# Deploying the Backend on Vercel

This backend is a Node.js/Express API that runs on Vercel as a **serverless function**.

## How it is wired

| File | Purpose |
|------|---------|
| [`api/index.js`](api/index.js) | Serverless entry point. Connects to MongoDB (cached) then forwards every request to the Express app. |
| [`src/app.js`](src/app.js) | The Express app (routes, middleware, CORS). No `app.listen()` here. |
| [`src/server.js`](src/server.js) | Local/traditional hosting entry point that calls `app.listen()`. |
| [`vercel.json`](vercel.json) | Rewrites all paths to the function and sets a 60s max duration. |
| [`src/config/db.js`](src/config/db.js) | Reuses a single MongoDB connection across warm invocations. |

## 1. Prerequisites

- A GitHub repository containing this project.
- A MongoDB Atlas cluster (free tier is fine). See the main README.
- Your AI provider API key (OpenAI / Gemini / AgentRouter).

## 2. Import the project into Vercel

1. Go to <https://vercel.com/new> and import your Git repository.
2. **Root Directory:** `backend`
3. **Framework Preset:** `Other`
4. **Build Command:** leave empty (no build step needed)
5. **Output Directory:** leave empty

## 3. Environment Variables

Add these in **Project Settings → Environment Variables** (Production + Preview):

| Variable | Required | Example / Notes |
|----------|----------|-----------------|
| `NODE_ENV` | Yes | `production` |
| `MONGO_URI` | Yes | `mongodb+srv://user:pass@cluster0.mongodb.net/ai_resume_builder` |
| `JWT_SECRET` | Yes | A long random string |
| `JWT_EXPIRES_IN` | No | `7d` |
| `CLIENT_URL` | Yes | Your frontend URL(s), comma-separated. e.g. `https://your-frontend.onrender.com` |
| `OPENAI_API_KEY` | Yes | Your AI provider key |
| `OPENAI_BASE_URL` | No | `https://api.openai.com/v1` (or Gemini-compatible endpoint) |
| `OPENAI_MODEL` | No | `gpt-4o-mini` |
| `EMAIL_HOST` | No | `smtp.gmail.com` |
| `EMAIL_PORT` | No | `587` |
| `EMAIL_USER` | No | Gmail address (for password reset) |
| `EMAIL_PASS` | No | Gmail App Password |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |

> `PORT` is **not** needed on Vercel. Vercel assigns the port automatically and
> routes traffic through the serverless function. It is only used by `src/server.js`
> for local/other hosting.

## 4. Deploy

Click **Deploy**. After it finishes, verify the API:

```
https://<your-backend>.vercel.app/api/health
```

Expected response:

```json
{ "status": "ok", "message": "AI Resume Builder API is running", "timestamp": "..." }
```

## 5. Point the frontend at the backend

In your frontend `.env` (or hosting dashboard, e.g. Render Environment), set:

```env
VITE_API_URL=https://<your-backend>.vercel.app/api
```

Note: this is a build-time variable for Vite. After changing it you MUST trigger a
new frontend build/redeploy, otherwise the old value stays baked into the bundle.

Make sure the frontend URL is included in the backend's `CLIENT_URL` so CORS allows it.
Origins on `*.vercel.app`, `*.onrender.com` and `*.netlify.app` are auto-accepted,
so a Render-hosted frontend works without extra config. Any custom domain MUST be
added to `CLIENT_URL`.

Actual wiring for this project: frontend on Render
(`https://ai-resume-builder-38iq.onrender.com`), backend on Vercel
(`https://ai-resume-builder-bambam05.vercel.app`). So:

- Backend `CLIENT_URL` = `https://ai-resume-builder-38iq.onrender.com`
- Frontend `VITE_API_URL` = `https://ai-resume-builder-bambam05.vercel.app/api`

## Notes & limitations

- **Serverless body size:** Vercel caps request/response bodies at ~4.5 MB. The app's
  AI/upload endpoints work within this, but very large files may fail; keep uploads small.
- **Cold starts:** The first request after idle may be slower while MongoDB reconnects.
  Connections are cached to keep warm invocations fast.
- **Streaming (AI chat):** The `/api/ai/chat` endpoint uses Server-Sent Events. It works
  on Vercel, but total execution is bounded by the function `maxDuration` (60s here).
- **File uploads:** Handled in-memory via Multer, which is compatible with Vercel's
  read-only filesystem. No persistent disk is used.

## Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| **"Network Error" on login/signup** | CORS preflight blocked. The frontend origin must be allowed. Render origins (`*.onrender.com`) are auto-allowed; otherwise add it to `CLIENT_URL` and redeploy the backend. Also verify the frontend was rebuilt after setting `VITE_API_URL`. |
| `MONGO_URI not set` warning | Add `MONGO_URI` in Vercel env vars and redeploy. |
| `500` on auth/resume routes | MongoDB Atlas IP allowlist — allow `0.0.0.0/0` (or Vercel IPs). |
| CORS error in browser | Add the frontend origin to `CLIENT_URL` (comma-separated) and redeploy. |
| Requests hit the frontend host instead of the API | `VITE_API_URL` was missing at build time. Set it and rebuild. |
| Cold-start timeout | Render/Vercel free tiers sleep. The client waits 30s (see `frontend/src/services/api.js`). |
| `401 Unauthorized` from AI | The AI provider rejected `OPENAI_API_KEY` (invalid key / no credits). |
| `504` on long AI calls | Increase `maxDuration` in `vercel.json` (Pro plans allow longer). |

# 🚀 AI Resume Builder

> An AI-powered resume builder that goes beyond CRUD — built for CSE portfolios and placement-ready. Features 25+ resume templates, AI writing assistant, ATS score checker, streaming AI chat, mock interviews, and much more.

![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20AI-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-green)
![Backend](https://img.shields.io/badge/Backend-Node%20%2B%20Express-success)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen)

---

## ✨ Features

### Core Features
| # | Feature | Description |
|---|---------|-------------|
| 1 | **User Authentication** | JWT-based auth with signup, login, forgot/reset password via email, optional Google OAuth |
| 2 | **Dashboard** | Analytics cards (resumes, ATS score, downloads, views), quick actions, recent resumes with duplicate/delete/history menu |
| 3 | **Resume Builder** | 8 sections (Personal Info, Experience, Education, Skills, Projects, Certifications, Languages, Interests) with add/remove, live preview, autosave |
| 4 | **AI Writing Assistant** | Improve bullet points, generate professional summaries with one click |
| 5 | **ATS Score Checker** | AI-powered ATS compatibility scoring with detailed report and actionable suggestions |
| 6 | **15 Resume Templates** | Modern, Professional, Creative, Minimal, Harvard, ATS, Elegant, Compact, Bold, Classic, Tech, Executive, Sidebar, Gradient, Clean |
| 7 | **PDF Download** | Multi-page PDF export with html2canvas + jsPDF |
| 8 | **AI Resume Review** | Comprehensive AI review with strengths, weaknesses, and improvement suggestions |
| 9 | **AI Skill Suggestions** | Role-based skill recommendations based on current skills |
| 10 | **Cover Letter Generator** | AI-generated cover letters tailored to job descriptions |
| 11 | **Job Description Matching** | Match score + gap analysis between resume and JD |
| 12 | **Dark Mode** | Full dark/light theme with system preference detection and persistence |
| 13 | **Multi-Language** | English + Hindi (हिन्दी) via i18next |
| 14 | **Resume History** | Version snapshots with timeline UI and one-click restore |
| 15 | **AI Chat** | Streaming AI career advisor chat (Server-Sent Events) with markdown rendering |

### Placement-Level Extra Features
| # | Feature | Description |
|---|---------|-------------|
| 16 | **AI Mock Interview** | Practice technical/behavioral/HR questions with AI evaluation |
| 17 | **LinkedIn Headline Generator** | AI-crafted headlines based on role, skills, and experience |
| 18 | **GitHub README Generator** | Auto-generate impressive profile READMEs from resume data |
| 19 | **Career Roadmap** | Personalized learning path from current level to target role |
| 20 | **Interview Question Bank** | Role-specific question sets (technical, behavioral, mixed) |
| 21 | **Grammar Checker** | AI-powered grammar and style suggestions |
| 22 | **Keyword Optimizer** | ATS keyword gap analysis against job descriptions |
| 23 | **AI Portfolio Generator** | Generate portfolio website content from resume |
| 24 | **Resume Analytics** | Track downloads, views, and ATS score trends |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — Fast development & builds
- **Tailwind CSS** — Utility-first styling with dark mode
- **Framer Motion** — Smooth animations
- **React Hook Form** — Performant forms
- **React Router v6** — Client-side routing
- **i18next** — Internationalization (English/Hindi)
- **Axios** — HTTP client with interceptors
- **React Markdown** — Markdown rendering for AI responses
- **html2canvas + jsPDF** — PDF generation
- **Lucide React** — Icon library

### Backend
- **Node.js** + **Express.js** — REST API
- **MongoDB** + **Mongoose** — Database & ODM
- **JWT** + **bcryptjs** — Authentication & password hashing
- **OpenAI SDK** — AI integration (compatible with OpenAI, Gemini, AgentRouter)
- **Nodemailer** — Email service for password reset
- **Helmet** + **CORS** + **express-rate-limit** — Security
- **Morgan** — HTTP logging

### AI Provider
The app uses the OpenAI SDK with configurable base URL, making it compatible with:
- OpenAI (GPT-4, GPT-3.5)
- Google Gemini (via OpenAI-compatible endpoint)
- AgentRouter / GLM models
- Any OpenAI-compatible API

---

## 📁 Project Structure

```
ai-resume-builder/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── env.js             # Environment config
│   │   ├── controllers/
│   │   │   ├── aiController.js    # 16 AI endpoints
│   │   │   ├── authController.js  # Auth logic
│   │   │   └── resumeController.js # Resume CRUD + history
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT protect
│   │   │   └── errorMiddleware.js # Error handling
│   │   ├── models/
│   │   │   ├── Resume.js          # Resume schema + versions
│   │   │   └── User.js            # User schema
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── resumeRoutes.js
│   │   ├── utils/
│   │   │   ├── aiService.js       # OpenAI client wrapper
│   │   │   └── emailService.js    # Nodemailer
│   │   └── server.js              # Express app entry
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── AuthLayout.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── resume/
│   │   │   │   ├── AIAssistModal.jsx
│   │   │   │   └── ResumePreview.jsx  # 15 templates
│   │   │   └── ui/
│   │   │       └── Loader.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── i18n/
│   │   │   └── i18n.js             # EN + HI translations
│   │   ├── pages/
│   │   │   ├── ai/
│   │   │   │   ├── AIChat.jsx       # Streaming chat
│   │   │   │   └── AITools.jsx      # 13 AI tools
│   │   │   ├── auth/
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── ResetPassword.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── builder/
│   │   │   │   └── ResumeBuilder.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── ResumeHistory.jsx
│   │   │   └── Templates.jsx
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── defaultResume.js
│   │   │   └── pdfGenerator.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas)
- An AI API key (OpenAI / Gemini / AgentRouter)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend** — Copy `backend/.env.example` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Fill in your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-resume-builder
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173

# AI Configuration (works with OpenAI, Gemini, AgentRouter)
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# Email (optional - for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Frontend** — Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend (runs on :5000)
cd backend
npm run dev

# Terminal 2 - Frontend (runs on :5173)
cd frontend
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 🔑 Environment Variables

### Backend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `CLIENT_URL` | No | Frontend URL for CORS |
| `OPENAI_API_KEY` | Yes | AI provider API key |
| `OPENAI_BASE_URL` | No | AI provider base URL |
| `OPENAI_MODEL` | No | Model name (default: gpt-4o-mini) |
| `EMAIL_USER` | No | Email for password reset |
| `EMAIL_PASS` | No | Email app password |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |

### Frontend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API URL (default: /api) |

---

## 📡 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | Login user |
| POST | `/google` | Google OAuth login |
| POST | `/forgot-password` | Send reset email |
| POST | `/reset-password/:token` | Reset password |
| GET | `/me` | Get current user |
| PUT | `/preferences` | Update theme/language |

### Resume Routes (`/api/resumes`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all resumes |
| POST | `/` | Create resume |
| GET | `/:id` | Get single resume |
| PUT | `/:id` | Update resume (with optional version save) |
| DELETE | `/:id` | Delete resume |
| POST | `/:id/duplicate` | Duplicate resume |
| GET | `/:id/history` | Get version history |
| POST | `/:id/restore/:versionIndex` | Restore a version |
| POST | `/:id/download` | Increment download counter |
| GET | `/analytics/summary` | Get analytics |

### AI Routes (`/api/ai`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/improve` | Improve text (bullet points, summaries) |
| POST | `/summary` | Generate professional summary |
| POST | `/ats-score` | ATS compatibility score |
| POST | `/suggest-skills` | Skill recommendations |
| POST | `/cover-letter` | Generate cover letter |
| POST | `/match-jd` | Job description match analysis |
| POST | `/chat` | Streaming AI chat (SSE) |
| POST | `/review` | Comprehensive resume review |
| POST | `/mock-interview` | AI mock interview |
| POST | `/linkedin-headline` | LinkedIn headline generator |
| POST | `/github-readme` | GitHub README generator |
| POST | `/career-roadmap` | Career roadmap generator |
| POST | `/interview-questions` | Interview question bank |
| POST | `/grammar-check` | Grammar & style checker |
| POST | `/optimize-keywords` | ATS keyword optimizer |
| POST | `/portfolio` | Portfolio content generator |

---

## 🌐 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Set root directory to `frontend`
4. Add environment variable `VITE_API_URL`
5. Deploy

### Backend → Render
1. Push to GitHub
2. Create new Web Service in Render
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables
7. Deploy

### Database → MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create database user
3. Whitelist IP (`0.0.0.0/0` for all)
4. Get connection string → set as `MONGO_URI`

---

## 🎯 Key Technical Highlights

- **Streaming AI Chat**: Server-Sent Events (SSE) for real-time token streaming
- **Resume Versioning**: Snapshot-based version history with one-click restore
- **15 Templates**: Inline-styled React components for PDF capture compatibility
- **Multi-page PDF**: Automatic page splitting with html2canvas + jsPDF
- **Debounced Autosave**: 2-second debounce on resume edits
- **Graceful Fallbacks**: Server runs even without MongoDB or AI key (with helpful errors)
- **Safe JSON Parsing**: AI responses parsed with markdown fence stripping
- **i18n**: Full English/Hindi translation support
- **Dark Mode**: Class-based with system preference detection

---

## 📝 License

MIT — Free to use for portfolios, placements, and learning.

---

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize!

---

Built with ❤️ for CSE students aiming for placement success.

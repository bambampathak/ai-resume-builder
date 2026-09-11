import axios from "axios";

// Resolve the backend base URL.
// 1. Prefer VITE_API_URL (set this in your hosting dashboard).
// 2. In local dev, fall back to the Vite proxy path "/api".
// 3. In production, if VITE_API_URL is missing, fall back to the deployed
//    Vercel backend so a missing env var doesn't result in a "/api" request
//    hitting the frontend host (which surfaces as a "Network Error").
const PRODUCTION_API_URL =
  "https://ai-resume-builder-bambam05.vercel.app/api";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? PRODUCTION_API_URL : "/api");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Render free instances may need extra time to spin up on a cold start.
  timeout: 30000,
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message =
      error.response?.data?.message || error.message || "Something went wrong";

    // No response at all => the request never reached the server. This is the
    // classic CORS-block / wrong-URL / server-down symptom (Axios: "Network Error").
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        message = "Request timed out. The server may be waking up — please try again.";
      } else {
        message =
          "Unable to reach the server. Please check your connection and try again.";
      }
    }

    // Auto logout on 401
    if (error.response?.status === 401) {
      const isAuthRoute =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/signup");
      if (!isAuthRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject({ ...error, message });
  }
);

export default api;

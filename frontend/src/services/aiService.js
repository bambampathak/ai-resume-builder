import api from "./api.js";

export const aiApi = {
  improveText: (text, type, context = "") =>
    api.post("/ai/improve", { text, type, context }).then((r) => r.data),

  generateSummary: (data) =>
    api.post("/ai/summary", data).then((r) => r.data),

  atsScore: (resumeData, jobDescription = "") =>
    api.post("/ai/ats-score", { resumeData, jobDescription }).then((r) => r.data),

  atsScoreUpload: (file, jobDescription = "") => {
    const formData = new FormData();
    formData.append("resumeFile", file);
    formData.append("jobDescription", jobDescription);
    return api
      .post("/ai/ats-score-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  suggestSkills: (role, currentSkills = []) =>
    api.post("/ai/suggest-skills", { role, currentSkills }).then((r) => r.data),

  generateCoverLetter: (data) =>
    api.post("/ai/cover-letter", data).then((r) => r.data),

  matchJobDescription: (jobDescription, resumeData) =>
    api.post("/ai/match-jd", { jobDescription, resumeData }).then((r) => r.data),

  reviewResume: (resumeText) =>
    api.post("/ai/review", { resumeText }).then((r) => r.data),

  mockInterview: (role, type = "technical", previousQA = []) =>
    api.post("/ai/mock-interview", { role, type, previousQA }).then((r) => r.data),

  linkedinHeadline: (role, skills = [], experience = "") =>
    api.post("/ai/linkedin-headline", { role, skills, experience }).then((r) => r.data),

  githubReadme: (data) =>
    api.post("/ai/github-readme", data).then((r) => r.data),

  careerRoadmap: (role, currentLevel = "beginner", goal = "") =>
    api.post("/ai/career-roadmap", { role, currentLevel, goal }).then((r) => r.data),

  interviewQuestions: (role, type = "mixed", count = 10) =>
    api.post("/ai/interview-questions", { role, type, count }).then((r) => r.data),

  grammarCheck: (text) =>
    api.post("/ai/grammar-check", { text }).then((r) => r.data),

  optimizeKeywords: (resumeData, jobDescription) =>
    api.post("/ai/optimize-keywords", { resumeData, jobDescription }).then((r) => r.data),

  generatePortfolio: (resumeData) =>
    api.post("/ai/portfolio", { resumeData }).then((r) => r.data),
};

export default aiApi;

import express from "express";
import {
  improveText,
  generateSummary,
  atsScore,
  atsScoreUpload,
  suggestSkills,
  generateCoverLetter,
  matchJobDescription,
  aiChat,
  reviewResume,
  mockInterview,
  linkedinHeadline,
  githubReadme,
  careerRoadmap,
  interviewQuestions,
  grammarCheck,
  optimizeKeywords,
  generatePortfolio,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All AI routes require authentication
router.use(protect);

// Core AI features
router.post("/improve", improveText);
router.post("/summary", generateSummary);
router.post("/ats-score", atsScore);
router.post("/ats-score-upload", upload.single("resumeFile"), atsScoreUpload);
router.post("/suggest-skills", suggestSkills);
router.post("/cover-letter", generateCoverLetter);
router.post("/match-jd", matchJobDescription);
router.post("/chat", aiChat);
router.post("/review", reviewResume);

// Placement-level extra features
router.post("/mock-interview", mockInterview);
router.post("/linkedin-headline", linkedinHeadline);
router.post("/github-readme", githubReadme);
router.post("/career-roadmap", careerRoadmap);
router.post("/interview-questions", interviewQuestions);
router.post("/grammar-check", grammarCheck);
router.post("/optimize-keywords", optimizeKeywords);
router.post("/portfolio", generatePortfolio);

export default router;

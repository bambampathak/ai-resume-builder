import { chatCompletion, streamChatCompletion, safeJsonParse } from "../utils/aiService.js";
import { generateDemoResponse } from "../utils/demoService.js";
import Resume from "../models/Resume.js";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// pdf-parse and mammoth are CommonJS modules
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// ============================================================
// 1. AI WRITING ASSISTANT - improve experience/project/summary
// ============================================================
export const improveText = async (req, res, next) => {
  try {
    const { text, type = "experience", context = "" } = req.body;

    if (!text) {
      res.status(400);
      return next(new Error("Text is required"));
    }

    const typeInstructions = {
      experience:
        "Rewrite this work experience bullet point to be professional, action-oriented, and quantified where possible. Use strong action verbs. Keep it 1-2 sentences.",
      project:
        "Rewrite this project description to be professional and impactful. Highlight technologies used, the problem solved, and key achievements. Keep it 2-3 sentences.",
      summary:
        "Rewrite this professional summary to be compelling and 80-90 words (approximately 3 lines, 4-5 sentences). Highlight key strengths, relevant skills, experience, and career goals. Do NOT write fewer than 80 words.",
      education:
        "Rewrite this education description to be professional and highlight relevant coursework or achievements.",
      bullet:
        "Rewrite this resume bullet point to be impactful, quantified, and start with a strong action verb.",
    };

    const instruction = typeInstructions[type] || typeInstructions.experience;

    const messages = [
      {
        role: "system",
        content:
          "You are an expert resume writer and ATS optimization specialist. You help job seekers craft compelling, professional resume content. Always respond with ONLY the improved text, no explanations or markdown formatting.",
      },
      {
        role: "user",
        content: `${instruction}\n\nOriginal text: "${text}"\n${context ? `Additional context: ${context}` : ""}\n\nImproved text:`,
      },
    ];

    const improved = await chatCompletion(messages, { temperature: 0.7, maxTokens: 500 });
    res.json({ success: true, original: text, improved: improved.trim() });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 2. GENERATE SUMMARY
// ============================================================
export const generateSummary = async (req, res, next) => {
  try {
    const { jobTitle, skills = [], experience = [], projects = [] } = req.body;

    if (!jobTitle) {
      res.status(400);
      return next(new Error("Job title is required"));
    }

    const expText = experience
      .map((e) => `${e.position} at ${e.company}`)
      .join(", ");
    const projText = projects.map((p) => p.name).join(", ");

    const messages = [
      {
        role: "system",
        content:
          "You are an expert resume writer. Generate a compelling professional summary. The summary MUST be 80-90 words (approximately 3 lines) and 4-5 well-crafted sentences. Highlight key strengths, relevant skills, years of experience, and career goals. Do NOT write fewer than 80 words. Respond with ONLY the summary text, no markdown, no explanations.",
      },
      {
        role: "user",
        content: `Generate a professional resume summary for a ${jobTitle}.
Skills: ${skills.join(", ")}
Experience: ${expText || "Entry level"}
Projects: ${projText || "N/A"}

The summary must be between 80 and 90 words. Count carefully and ensure the output is at least 80 words.

Summary:`,
      },
    ];

    const summary = await chatCompletion(messages, { temperature: 0.7, maxTokens: 500 });
    res.json({ success: true, summary: summary.trim() });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 3. ATS SCORE CHECKER
// ============================================================
export const atsScore = async (req, res, next) => {
  try {
    const { resumeData, jobDescription = "" } = req.body;

    if (!resumeData) {
      res.status(400);
      return next(new Error("Resume data is required"));
    }

    const resumeText = buildResumeText(resumeData);

    console.log(`[ATS] Start analysis - user=${req.user?._id || "anon"} resumeId=${resumeData._id || "N/A"} resumeTextLength=${resumeText.length}`);

    const messages = [
      {
        role: "system",
        content: `You are an ATS (Applicant Tracking System) expert. Analyze the resume and return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "problems": [
    {"type": "error"|"warning"|"success", "message": "description", "section": "section name"}
  ],
  "suggestions": ["actionable suggestion 1", "suggestion 2"],
  "keywords": {
    "found": ["keyword1"],
    "missing": ["keyword2"]
  },
  "sectionScores": {
    "contact": <0-100>,
    "summary": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "skills": <0-100>,
    "projects": <0-100>
  }
}
Return ONLY valid JSON, no markdown.`,
      },
      {
        role: "user",
        content: `Analyze this resume for ATS compatibility:\n\n${resumeText}\n\n${jobDescription ? `Target Job Description:\n${jobDescription}` : ""}`,
      },
    ];

    let result = await chatCompletion(messages, { json: true, temperature: 0.3, maxTokens: 1200 });
    console.log(`[ATS] AI response length: ${String(result || "").length}`);
    console.log(`[ATS] AI response preview:\n${String(result || "").slice(0, 1500)}`);
    let parsed = safeJsonParse(result);

    if (!parsed) console.warn('[ATS] Warning: initial JSON parse failed for AI response');

    // If parsing failed, try the demo generator as a fallback to ensure consistent JSON
    if (!parsed) {
      console.log('[ATS] Falling back to demo generator for ATS analysis');
      const demo = generateDemoResponse(messages, { json: true });
      console.log(`[ATS] Demo response length: ${String(demo || "").length}`);
      console.log(`[ATS] Demo response preview:\n${String(demo || "").slice(0, 1500)}`);
      parsed = safeJsonParse(demo);
      if (!parsed) console.error('[ATS] Error: demo response JSON parse also failed');
    }

    // Save ATS score to resume if id provided
    if (resumeData._id && req.user) {
      try {
        const upd = await Resume.findOneAndUpdate(
          { _id: resumeData._id, user: req.user._id },
          { atsScore: parsed.score, atsReport: parsed }
        );
        console.log(`[ATS] Saved ATS report for resume ${resumeData._id}`);
      } catch (dbErr) {
        console.error('[ATS] DB save error:', dbErr.message || dbErr);
      }
    }

    res.json({ success: true, report: parsed });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 3b. ATS SCORE CHECKER - from uploaded PDF/DOCX file
// ============================================================
export const atsScoreUpload = async (req, res, next) => {
  try {
    const { jobDescription = "" } = req.body;

    if (!req.file) {
      res.status(400);
      return next(new Error("Resume file is required"));
    }

    const resumeText = await extractTextFromFile(req.file);

    console.log(`[ATS-Upload] Start - user=${req.user?._id || "anon"} file=${req.file.originalname} size=${req.file.size}`);

    if (!resumeText || resumeText.trim().length < 20) {
      res.status(400);
      return next(new Error("Could not extract enough text from the file. Please ensure it is a text-based PDF/DOCX (not a scanned image)."));
    }

    const messages = [
      {
        role: "system",
        content: `You are an ATS (Applicant Tracking System) expert. Analyze the resume and return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "problems": [
    {"type": "error"|"warning"|"success", "message": "description", "section": "section name"}
  ],
  "suggestions": ["actionable suggestion 1", "suggestion 2"],
  "keywords": {
    "found": ["keyword1"],
    "missing": ["keyword2"]
  },
  "sectionScores": {
    "contact": <0-100>,
    "summary": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "skills": <0-100>,
    "projects": <0-100>
  }
}
Return ONLY valid JSON, no markdown.`,
      },
      {
        role: "user",
        content: `Analyze this resume for ATS compatibility:\n\n${resumeText}\n\n${jobDescription ? `Target Job Description:\n${jobDescription}` : ""}`,
      },
    ];

    let result = await chatCompletion(messages, { json: true, temperature: 0.3, maxTokens: 1200 });
    console.log(`[ATS-Upload] AI response length: ${String(result || "").length}`);
    console.log(`[ATS-Upload] AI response preview:\n${String(result || "").slice(0, 1500)}`);
    let parsed = safeJsonParse(result);
    if (!parsed) console.warn('[ATS-Upload] Warning: initial JSON parse failed for AI response');

    if (!parsed) {
      console.log('[ATS-Upload] Falling back to demo generator for ATS analysis');
      const demo = generateDemoResponse(messages, { json: true });
      console.log(`[ATS-Upload] Demo response length: ${String(demo || "").length}`);
      console.log(`[ATS-Upload] Demo response preview:\n${String(demo || "").slice(0, 1500)}`);
      parsed = safeJsonParse(demo);
      if (!parsed) console.error('[ATS-Upload] Error: demo response JSON parse also failed');
    }

    res.json({ success: true, report: parsed, fileName: req.file.originalname });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// Helper: extract text from uploaded file buffer
// ============================================================
const extractTextFromFile = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const buffer = file.buffer;

  if (ext === ".pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === ".docx" || ext === ".doc") {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
};

// ============================================================
// 4. AI SKILL SUGGESTIONS
// ============================================================
export const suggestSkills = async (req, res, next) => {
  try {
    const { role, currentSkills = [] } = req.body;

    if (!role) {
      res.status(400);
      return next(new Error("Role is required"));
    }

    const messages = [
      {
        role: "system",
        content: `You are a tech career advisor. Suggest relevant skills for a given role. Return JSON:
{
  "technical": ["skill1", "skill2"],
  "soft": ["skill1", "skill2"],
  "tools": ["tool1", "tool2"],
  "frameworks": ["framework1"]
}
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Suggest skills for a "${role}" role. The user already has: ${currentSkills.join(", ") || "none"}. Suggest skills they are missing.`,
      },
    ];

    const result = await chatCompletion(messages, { json: true, temperature: 0.5, maxTokens: 600 });
    const parsed = safeJsonParse(result) || { technical: [], soft: [], tools: [], frameworks: [] };
    res.json({ success: true, skills: parsed });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 5. COVER LETTER GENERATOR
// ============================================================
export const generateCoverLetter = async (req, res, next) => {
  try {
    const {
      company: rawCompany,
      role: rawRole,
      experience: rawExperience = "",
      skills: rawSkills = [],
      userName: rawUserName,
      name = "",
      jobDescription: rawJobDescription = "",
    } = req.body;
    const company = String(rawCompany || "").trim();
    const role = String(rawRole || "").trim();
    const experience = String(rawExperience || "").trim();
    const userName = String(rawUserName || name || "").trim();
    const jobDescription = String(rawJobDescription || "").trim();
    const skills = (Array.isArray(rawSkills) ? rawSkills : String(rawSkills).split(","))
      .map((skill) => String(skill).trim())
      .filter(Boolean);

    if (!company || !role) {
      res.status(400);
      return next(new Error("Company and role are required"));
    }

    const messages = [
      {
        role: "system",
        content:
          "You are an expert cover letter writer. Write a professional, personalized cover letter. Keep it 3-4 paragraphs. Use proper business letter format. Respond with ONLY the cover letter text.",
      },
      {
        role: "user",
        content: `Write a cover letter for:
- Applicant name: ${userName || "Not provided"}
- Company: ${company}
- Role: ${role}
- Experience: ${experience || "Entry level"}
- Key skills: ${skills.join(", ")}
${jobDescription ? `- Job description highlights: ${jobDescription}` : ""}

Cover letter:`,
      },
    ];

    const letter = await chatCompletion(messages, { temperature: 0.7, maxTokens: 1000 });
    res.json({ success: true, coverLetter: letter.trim() });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 6. JOB DESCRIPTION MATCHING
// ============================================================
export const matchJobDescription = async (req, res, next) => {
  try {
    const { jobDescription, resumeData } = req.body;

    if (!jobDescription) {
      res.status(400);
      return next(new Error("Job description is required"));
    }

    const resumeText = buildResumeText(resumeData || {});

    const messages = [
      {
        role: "system",
        content: `You are a job matching expert. Compare a resume to a job description. Return JSON:
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["skill1"],
  "missingSkills": ["skill1"],
  "recommendations": ["actionable recommendation"],
  "strengths": ["what matches well"],
  "gaps": ["what's missing"]
}
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Job Description:\n${jobDescription}\n\nResume:\n${resumeText}`,
      },
    ];

    const result = await chatCompletion(messages, { json: true, temperature: 0.3, maxTokens: 1000 });
    const parsed = safeJsonParse(result) || {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      recommendations: [],
      strengths: [],
      gaps: [],
    };
    res.json({ success: true, match: parsed });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 7. AI CHAT (streaming)
// ============================================================
export const aiChat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      res.status(400);
      return next(new Error("Message is required"));
    }

    const systemPrompt = {
      role: "system",
      content:
        "You are an AI career advisor and resume expert. Help users improve their resumes, suggest projects, recommend skills, and give interview tips. Be concise, practical, and encouraging. Use markdown formatting for readability.",
    };

    const messages = [
      systemPrompt,
      ...history.slice(-10).map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: message },
    ];

    const stream = await streamChatCompletion(messages, { temperature: 0.7 });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    } else {
      res.end();
    }
  }
};

// ============================================================
// 8. AI RESUME REVIEW (upload text)
// ============================================================
export const reviewResume = async (req, res, next) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      res.status(400);
      return next(new Error("Resume text is required"));
    }

    const messages = [
      {
        role: "system",
        content: `You are a professional resume reviewer. Review the resume and return JSON:
{
  "overallScore": <0-100>,
  "grammar": {"score": <0-100>, "issues": ["issue1"]},
  "formatting": {"score": <0-100>, "issues": ["issue1"]},
  "atsCompatibility": {"score": <0-100>, "issues": ["issue1"]},
  "content": {"score": <0-100>, "issues": ["issue1"]},
  "suggestions": ["suggestion1"],
  "strengths": ["strength1"]
}
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Review this resume:\n\n${resumeText}`,
      },
    ];

    const result = await chatCompletion(messages, { json: true, temperature: 0.3, maxTokens: 1200 });
    const parsed = safeJsonParse(result) || { overallScore: 0, suggestions: [] };
    res.json({ success: true, review: parsed });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 9. AI MOCK INTERVIEW
// ============================================================
export const mockInterview = async (req, res, next) => {
  try {
    const { role, type = "technical", previousQA = [] } = req.body;

    if (!role) {
      res.status(400);
      return next(new Error("Role is required"));
    }

    const messages = [
      {
        role: "system",
        content: `You are an interviewer conducting a ${type} interview for a ${role} position. Ask one question at a time. If the candidate has answered previous questions, evaluate their answer briefly then ask the next question. Return JSON:
{
  "question": "the interview question",
  "evaluation": "brief evaluation of last answer or null if first question",
  "tips": "tip for answering this question"
}
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: previousQA.length
          ? `Previous Q&A: ${JSON.stringify(previousQA)}. Ask the next question.`
          : `Start the ${type} interview for a ${role} position. Ask the first question.`,
      },
    ];

    const result = await chatCompletion(messages, { json: true, temperature: 0.7, maxTokens: 600 });
    const parsed = safeJsonParse(result) || { question: "Tell me about yourself.", evaluation: null, tips: "" };
    res.json({ success: true, interview: parsed });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 10. LINKEDIN HEADLINE GENERATOR
// ============================================================
export const linkedinHeadline = async (req, res, next) => {
  try {
    const { role, skills = [], experience = "" } = req.body;

    if (!role) {
      res.status(400);
      return next(new Error("Role is required"));
    }

    const messages = [
      {
        role: "system",
        content: `Generate 5 compelling LinkedIn headlines. Return JSON: {"headlines": ["headline1", "headline2", ...]}. Each headline should be under 220 characters. Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Role: ${role}\nSkills: ${skills.join(", ")}\nExperience: ${experience || "Entry level"}`,
      },
    ];

    const result = await chatCompletion(messages, { json: true, temperature: 0.8, maxTokens: 500 });
    const parsed = safeJsonParse(result) || { headlines: [] };
    res.json({ success: true, headlines: parsed.headlines });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 11. GITHUB README GENERATOR
// ============================================================
export const githubReadme = async (req, res, next) => {
  try {
    const { projectName, description, techStack = [], features = [] } = req.body;

    if (!projectName) {
      res.status(400);
      return next(new Error("Project name is required"));
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a technical writer. Generate a professional GitHub README in markdown format. Include sections: title, description, features, tech stack, installation, usage, and license. Respond with ONLY markdown.",
      },
      {
        role: "user",
        content: `Project: ${projectName}\nDescription: ${description || ""}\nTech stack: ${techStack.join(", ")}\nFeatures: ${features.join(", ")}`,
      },
    ];

    const readme = await chatCompletion(messages, { temperature: 0.7, maxTokens: 1500 });
    res.json({ success: true, readme });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 12. CAREER ROADMAP
// ============================================================
export const careerRoadmap = async (req, res, next) => {
  try {
    const { role, currentLevel = "beginner", goal = "" } = req.body;

    if (!role) {
      res.status(400);
      return next(new Error("Role is required"));
    }

    const messages = [
      {
        role: "system",
        content: `You are a career advisor. Create a detailed learning roadmap. Return JSON:
{
  "title": "Roadmap title",
  "duration": "estimated time",
  "phases": [
    {"name": "Phase 1", "duration": "time", "topics": ["topic1"], "resources": ["resource1"], "milestone": "milestone"}
  ],
  "tips": ["tip1"]
}
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Create a roadmap for becoming a ${role}. Current level: ${currentLevel}. Goal: ${goal || "Get a job"}`,
      },
    ];

    const result = await chatCompletion(messages, { json: true, temperature: 0.7, maxTokens: 1500 });
    const parsed = safeJsonParse(result) || { phases: [] };
    res.json({ success: true, roadmap: parsed });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 13. INTERVIEW QUESTION GENERATOR
// ============================================================
export const interviewQuestions = async (req, res, next) => {
  try {
    const { role, type = "mixed", count = 10 } = req.body;

    if (!role) {
      res.status(400);
      return next(new Error("Role is required"));
    }

    const messages = [
      {
        role: "system",
        content: `Generate interview questions. Return JSON: {"questions": [{"question": "q", "type": "technical|behavioral|hr", "difficulty": "easy|medium|hard", "sampleAnswer": "brief answer"}]}. Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Generate ${count} ${type} interview questions for a ${role} position.`,
      },
    ];

    const result = await chatCompletion(messages, { json: true, temperature: 0.7, maxTokens: 2000 });
    const parsed = safeJsonParse(result) || { questions: [] };
    res.json({ success: true, questions: parsed.questions });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 14. GRAMMAR CHECKER
// ============================================================
export const grammarCheck = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      res.status(400);
      return next(new Error("Text is required"));
    }

    const messages = [
      {
        role: "system",
        content: `Check grammar and style. Return JSON:
{
  "correctedText": "the corrected version",
  "issues": [{"original": "text", "correction": "fixed", "type": "grammar|spelling|style", "explanation": "why"}],
  "score": <0-100>
}
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: text,
      },
    ];

    const result = await chatCompletion(messages, { json: true, temperature: 0.3, maxTokens: 1000 });
    const parsed = safeJsonParse(result) || { correctedText: text, issues: [], score: 100 };
    res.json({ success: true, result: parsed });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 15. RESUME KEYWORD OPTIMIZER
// ============================================================
export const optimizeKeywords = async (req, res, next) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!jobDescription) {
      res.status(400);
      return next(new Error("Job description is required"));
    }

    const resumeText = buildResumeText(resumeData || {});

    const messages = [
      {
        role: "system",
        content: `Optimize resume keywords for a job description. Return JSON:
{
  "keywordsToAdd": ["keyword1"],
  "keywordsPresent": ["keyword1"],
  "suggestedPlacements": [{"keyword": "kw", "section": "where to add", "example": "example sentence"}],
  "impact": "brief impact description"
}
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
      },
    ];

    const result = await chatCompletion(messages, { json: true, temperature: 0.4, maxTokens: 1000 });
    const parsed = safeJsonParse(result) || { keywordsToAdd: [], keywordsPresent: [] };
    res.json({ success: true, optimization: parsed });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// 16. AI PORTFOLIO WEBSITE GENERATOR
// ============================================================
export const generatePortfolio = async (req, res, next) => {
  try {
    const { resumeData } = req.body;
    const resumeText = buildResumeText(resumeData || {});

    const messages = [
      {
        role: "system",
        content: `Generate a portfolio website HTML/CSS code based on resume data. Return JSON:
{
  "html": "complete HTML with inline styles",
  "sections": ["section names included"],
  "colorScheme": "primary color used",
  "features": ["feature1"]
}
The HTML should be a single self-contained file with modern, responsive design. Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Create a portfolio website for:\n${resumeText}`,
      },
    ];

    const result = await chatCompletion(messages, { json: true, temperature: 0.7, maxTokens: 4000 });
    const parsed = safeJsonParse(result) || { html: "", sections: [] };
    res.json({ success: true, portfolio: parsed });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// Helper: build resume text from structured data
// ============================================================
const buildResumeText = (data) => {
  const parts = [];
  const p = data.personalInfo || {};
  if (p.fullName) parts.push(`Name: ${p.fullName}`);
  if (p.jobTitle) parts.push(`Title: ${p.jobTitle}`);
  if (p.email) parts.push(`Email: ${p.email}`);
  if (p.phone) parts.push(`Phone: ${p.phone}`);
  if (p.location) parts.push(`Location: ${p.location}`);
  if (p.linkedin) parts.push(`LinkedIn: ${p.linkedin}`);
  if (p.github) parts.push(`GitHub: ${p.github}`);
  if (p.summary) parts.push(`\nSummary: ${p.summary}`);

  if (data.skills && data.skills.length) {
    parts.push(`\nSkills: ${data.skills.join(", ")}`);
  }

  if (data.experience && data.experience.length) {
    parts.push("\nExperience:");
    data.experience.forEach((e) => {
      parts.push(`- ${e.position} at ${e.company} (${e.startDate} - ${e.endDate || "Present"}): ${e.description}`);
    });
  }

  if (data.education && data.education.length) {
    parts.push("\nEducation:");
    data.education.forEach((e) => {
      parts.push(`- ${e.degree} in ${e.field} from ${e.institution} (${e.startDate} - ${e.endDate})`);
    });
  }

  if (data.projects && data.projects.length) {
    parts.push("\nProjects:");
    data.projects.forEach((p) => {
      parts.push(`- ${p.name} (${p.techStack}): ${p.description}`);
    });
  }

  if (data.certifications && data.certifications.length) {
    parts.push("\nCertifications:");
    data.certifications.forEach((c) => {
      parts.push(`- ${c.name} from ${c.issuer} (${c.date})`);
    });
  }

  if (data.languages && data.languages.length) {
    parts.push(`\nLanguages: ${data.languages.join(", ")}`);
  }

  return parts.join("\n") || "Empty resume";
};

#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { chatCompletion, safeJsonParse } from '../src/utils/aiService.js';
import { generateDemoResponse } from '../src/utils/demoService.js';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/ats_local_test.js <path-to-pdf>');
  process.exit(1);
}

(async () => {
  try {
    const data = fs.readFileSync(filePath);
    const parsed = await pdfParse(data);
    const text = parsed.text || '';
    if (!text || text.trim().length < 20) {
      console.error('Could not extract enough text from the file.');
      process.exit(2);
    }

    const messages = [
      {
        role: 'system',
        content: `You are an ATS (Applicant Tracking System) expert. Analyze the resume and return a JSON object with this exact structure:\n{\n  "score": <number 0-100>,\n  "problems": [\n    {"type": "error"|"warning"|"success", "message": "description", "section": "section name"}\n  ],\n  "suggestions": ["actionable suggestion 1", "suggestion 2"],\n  "keywords": {\n    "found": ["keyword1"],\n    "missing": ["keyword2"]\n  },\n  "sectionScores": {\n    "contact": <0-100>,\n    "summary": <0-100>,\n    "experience": <0-100>,\n    "education": <0-100>,\n    "skills": <0-100>,\n    "projects": <0-100>\n  }\n}\nReturn ONLY valid JSON, no markdown.`,
      },
      {
        role: 'user',
        content: `Analyze this resume for ATS compatibility:\n\n${text}`,
      },
    ];

    // Use the demo generator directly for local testing to get a deterministic JSON
    console.log('Running ATS analysis (demo generator)...');
    const result = generateDemoResponse(messages, { json: true });
    const parsedJson = safeJsonParse(result);
    if (!parsedJson) {
      console.error('Could not parse ATS result. Raw result:\n', result);
      process.exit(3);
    }

    console.log('ATS Report:');
    console.log(JSON.stringify(parsedJson, null, 2));
  } catch (err) {
    console.error('Error running local ATS test:', err);
    process.exit(4);
  }
})();

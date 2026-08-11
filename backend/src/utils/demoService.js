// ============================================================
// DEMO SERVICE - Fallback AI responses when API is unavailable
// Generates realistic, context-aware responses so the app is
// fully functional for portfolio demos without valid AI keys.
// When valid OPENAI_API_KEY is provided, real API is used instead.
// ============================================================

// Helper: extract user message content
const getUserContent = (messages) => {
  const userMsg = messages.find((m) => m.role === "user");
  return userMsg ? userMsg.content : "";
};

// Helper: extract system message content
const getSystemContent = (messages) => {
  const sysMsg = messages.find((m) => m.role === "system");
  return sysMsg ? sysMsg.content : "";
};

// Helper: extract a field value from text like "Role: Software Engineer"
const extractField = (content, fieldName) => {
  const regex = new RegExp(`${fieldName}:\\s*(.+?)(?:\\n|$)`, "i");
  const match = content.match(regex);
  return match ? match[1].trim() : "";
};

// Helper: extract text between quotes
const extractQuoted = (content, label) => {
  const regex = new RegExp(`${label}:\\s*"(.+?)"`, "s");
  const match = content.match(regex);
  return match ? match[1] : "";
};

// ============================================================
// 1. IMPROVE TEXT
// ============================================================
// Helper: pick a random element from an array (for varied demo responses)
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const demoImproveText = (messages) => {
  const content = getUserContent(messages);
  const originalText = extractQuoted(content, "Original text") || "your content";
  const sys = getSystemContent(messages).toLowerCase();

  if (sys.includes("project")) {
    return pickRandom([
      `Developed and deployed a scalable solution leveraging modern technologies, implementing best practices for code quality, testing, and CI/CD pipelines. Optimized performance by 40% and delivered a seamless user experience serving 1000+ active users, while collaborating cross-functionally with design and product teams.`,
      `Architected and launched a full-stack application from concept to production, integrating robust APIs and a responsive frontend. Reduced page load times by 45% through lazy loading and caching strategies, and increased user retention by 25% with an intuitive, accessible interface.`,
      `Engineered a high-performance platform handling 10,000+ daily requests, employing microservices and containerized deployment for reliability. Automated testing and CI/CD cut release cycles by 50%, while proactive monitoring reduced downtime to under 0.1%.`,
      `Built and shipped a feature-rich product using agile methodologies, partnering closely with stakeholders to translate requirements into scalable technical solutions. Improved conversion rates by 30% through data-driven UX refinements and delivered ahead of schedule with a 99.9% uptime SLA.`,
    ]);
  }
  if (sys.includes("summary")) {
    return pickRandom([
      `Results-driven professional with a proven track record of delivering high-impact solutions and driving technical excellence across the full software development lifecycle. Passionate about leveraging cutting-edge technologies to solve complex problems, accelerate business growth, and build scalable, maintainable systems. Recognized for strong analytical thinking, effective cross-functional collaboration, and a commitment to continuous learning and mentorship. Seeking to contribute deep expertise in software development, system design, and team leadership to a forward-thinking organization that values innovation, quality, and measurable impact.`,
      `Innovative and detail-oriented engineer with extensive experience building robust, user-centric applications and scalable backend systems. Adept at translating business requirements into elegant technical architectures, optimizing performance, and mentoring teams to adopt best practices. Strong communicator who thrives in collaborative, fast-paced environments and consistently delivers high-quality, maintainable code. Eager to apply a passion for clean design and continuous improvement to a dynamic organization committed to technical excellence and growth.`,
      `Versatile software professional combining deep technical expertise with a product-focused mindset to deliver reliable, high-performance solutions end to end. Skilled in modern frameworks, cloud infrastructure, and agile delivery, with a history of reducing costs and accelerating time-to-market. Proven ability to lead initiatives, mentor peers, and foster a culture of quality and accountability. Seeking a challenging role to drive innovation, scale impactful products, and grow alongside a mission-driven, forward-looking team.`,
    ]);
  }
  if (sys.includes("education")) {
    return pickRandom([
      `Graduated with distinction, maintaining a strong academic record while actively participating in technical projects, hackathons, and coding clubs. Completed advanced coursework in data structures, algorithms, and software engineering with hands-on project experience.`,
      `Earned a degree with honors, consistently ranking among the top performers while leading the college coding society and organizing technical workshops. Gained practical expertise through internships, capstone projects, and competitive programming contests.`,
      `Completed academic program with a high GPA, focusing on core computer science fundamentals alongside electives in machine learning and web development. Represented the institution in national hackathons and contributed to open-source student initiatives.`,
    ]);
  }
  if (sys.includes("bullet")) {
    return pickRandom([
      `Spearheaded the development of critical features, collaborating with cross-functional teams to deliver high-quality solutions ahead of schedule. Improved system efficiency by 35% through strategic optimizations, directly impacting 5000+ users.`,
      `Drove the redesign of core workflows, reducing processing time by 40% and elevating customer satisfaction scores. Coordinated with QA and product to ship 15+ features with zero critical defects.`,
      `Optimized database queries and refactored legacy modules, cutting API response times by half and supporting a 3x increase in daily active users without additional infrastructure cost.`,
    ]);
  }
  // Default: experience
  return pickRandom([
    `Led the end-to-end development of key product features, collaborating with cross-functional teams to deliver high-quality solutions on time. Improved system performance by 30% through code optimization and best practices, directly impacting 5000+ users and reducing operational costs by 20%.`,
    `Owned and shipped multiple high-impact features from requirements gathering to production deployment, partnering with product and design teams. Increased user engagement by 28% and reduced bug escape rate by 40% through robust testing and code reviews.`,
    `Spearheaded technical initiatives that modernized legacy systems and accelerated delivery cycles by 35%. Mentored junior engineers, established coding standards, and drove adoption of CI/CD pipelines that improved deployment reliability to 99.9%.`,
    `Architected scalable backend services and integrated third-party APIs, supporting a 4x growth in traffic. Championed performance tuning and observability, reducing incident response time by 50% and improving overall system uptime.`,
  ]);
};

// ============================================================
// 2. GENERATE SUMMARY
// ============================================================
const demoGenerateSummary = (messages) => {
  const content = getUserContent(messages);
  const jobTitle = extractField(content, "Generate a professional resume summary for a") ||
    extractField(content, "Job title") || "Software Engineer";
  const skillsMatch = content.match(/Skills:\s*(.+?)(?:\n|$)/i);
  const skills = skillsMatch ? skillsMatch[1] : "JavaScript, React, Node.js";

  return `Motivated and detail-oriented ${jobTitle} with proven expertise in ${skills}, delivering scalable, high-performance applications using modern technologies and industry best practices. Adept at designing robust architectures, optimizing system performance, and collaborating with cross-functional teams to translate business requirements into reliable technical solutions. Strong problem-solving mindset with a passion for clean code, automated testing, and continuous learning. Seeking to leverage technical expertise and collaborative leadership to drive impactful, user-centric solutions in a forward-thinking, growth-oriented organization.`;
};

// ============================================================
// 3. ATS SCORE
// ============================================================
const demoAtsScore = (messages) => {
  const content = getUserContent(messages);
  const hasSummary = /summary:/i.test(content);
  const hasExperience = /experience:/i.test(content);
  const hasEducation = /education:/i.test(content);
  const hasSkills = /skills:/i.test(content);
  const hasProjects = /projects:/i.test(content);

  let score = 45;
  const problems = [];
  const suggestions = [];
  const sectionScores = {};

  // Contact
  sectionScores.contact = /email:/i.test(content) ? 90 : 40;
  if (sectionScores.contact < 90) {
    problems.push({ type: "error", message: "Missing contact information (email, phone)", section: "contact" });
    suggestions.push("Add your email and phone number at the top of your resume");
  }

  // Summary
  sectionScores.summary = hasSummary ? 80 : 30;
  if (!hasSummary) {
    problems.push({ type: "warning", message: "No professional summary found", section: "summary" });
    suggestions.push("Add a 3-4 sentence professional summary highlighting your key strengths");
  }

  // Experience
  sectionScores.experience = hasExperience ? 75 : 35;
  if (!hasExperience) {
    problems.push({ type: "warning", message: "No work experience section detected", section: "experience" });
    suggestions.push("Add your work experience with quantified achievements");
  }

  // Education
  sectionScores.education = hasEducation ? 85 : 50;
  if (!hasEducation) {
    problems.push({ type: "warning", message: "Education section missing", section: "education" });
    suggestions.push("Include your educational qualifications");
  }

  // Skills
  sectionScores.skills = hasSkills ? 85 : 30;
  if (!hasSkills) {
    problems.push({ type: "error", message: "No skills section found - critical for ATS", section: "skills" });
    suggestions.push("Add a dedicated skills section with relevant keywords");
  }

  // Projects
  sectionScores.projects = hasProjects ? 70 : 45;
  if (!hasProjects) {
    problems.push({ type: "warning", message: "No projects section found", section: "projects" });
    suggestions.push("Add 2-3 relevant projects to showcase your skills");
  }

  // Calculate overall
  const sections = Object.values(sectionScores);
  score = Math.round(sections.reduce((a, b) => a + b, 0) / sections.length);

  if (score >= 70) {
    problems.push({ type: "success", message: "Your resume has good ATS compatibility", section: "general" });
  }

  suggestions.push("Use standard section headings (Experience, Education, Skills)");
  suggestions.push("Avoid tables, text boxes, and graphics that ATS cannot parse");
  suggestions.push("Include keywords from the job description in your resume");
  suggestions.push("Use a clean, single-column layout for maximum ATS compatibility");

  const keywords = {
    found: hasSkills ? content.match(/Skills:\s*(.+?)(?:\n|$)/i)?.[1]?.split(",").map((s) => s.trim()).slice(0, 5) || [] : [],
    missing: ["leadership", "agile", "collaboration", "problem-solving", "communication"],
  };

  return JSON.stringify({
    score,
    problems,
    suggestions,
    keywords,
    sectionScores,
  });
};

// ============================================================
// 4. SUGGEST SKILLS
// ============================================================
const demoSuggestSkills = (messages) => {
  const content = getUserContent(messages);
  const roleMatch = content.match(/"([^"]+)"\s*role/i);
  const role = roleMatch ? roleMatch[1].toLowerCase() : "software engineer";

  const skillSets = {
    "frontend": { technical: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript"], soft: ["Communication", "Attention to Detail", "Collaboration"], tools: ["VS Code", "Git", "Webpack", "Chrome DevTools"], frameworks: ["React", "Vue.js", "Next.js", "Tailwind CSS"] },
    "backend": { technical: ["Node.js", "Python", "REST APIs", "SQL"], soft: ["Problem Solving", "Analytical Thinking", "Teamwork"], tools: ["Docker", "Postman", "Git", "Linux"], frameworks: ["Express.js", "Django", "FastAPI", "Spring Boot"] },
    "full": { technical: ["JavaScript", "TypeScript", "Node.js", "SQL/NoSQL"], soft: ["Adaptability", "Communication", "Time Management"], tools: ["Git", "Docker", "VS Code", "AWS"], frameworks: ["React", "Express.js", "Next.js", "MongoDB"] },
    "data": { technical: ["Python", "SQL", "Statistics", "Machine Learning"], soft: ["Critical Thinking", "Storytelling", "Curiosity"], tools: ["Jupyter", "Tableau", "Git", "Excel"], frameworks: ["Pandas", "Scikit-learn", "TensorFlow", "PyTorch"] },
    "mobile": { technical: ["Java", "Kotlin", "Swift", "Dart"], soft: ["UI/UX Sense", "Problem Solving", "Collaboration"], tools: ["Android Studio", "Xcode", "Git", "Figma"], frameworks: ["Flutter", "React Native", "Jetpack Compose", "Firebase"] },
  };

  let key = "full";
  if (role.includes("front")) key = "frontend";
  else if (role.includes("back")) key = "backend";
  else if (role.includes("data")) key = "data";
  else if (role.includes("mobile") || role.includes("android") || role.includes("ios")) key = "mobile";

  return JSON.stringify(skillSets[key]);
};

// ============================================================
// 5. COVER LETTER
// ============================================================
const demoCoverLetter = (messages) => {
  const content = getUserContent(messages);
  const company = extractField(content, "Company") || "your company";
  const role = extractField(content, "Role") || "Software Engineer";
  const userName = extractField(content, "Applicant name") || "";
  const experience = extractField(content, "Experience") || "Entry level";

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. With a solid foundation in software development and a passion for building scalable, user-centric applications, I am confident that my skills and experience align well with your team's goals.

${experience !== "Entry level" ? `In my previous roles, I have successfully delivered high-impact projects, optimized system performance, and collaborated with cross-functional teams to bring products from concept to deployment. My experience in modern development practices, including agile methodologies and CI/CD pipelines, has equipped me to contribute effectively from day one.` : `As an enthusiastic and dedicated professional, I have built a strong portfolio of projects that demonstrate my ability to learn quickly, solve complex problems, and write clean, maintainable code. My academic background and hands-on project experience have prepared me to make meaningful contributions to your engineering team.`}

I am particularly drawn to ${company} because of your commitment to innovation and excellence. I am eager to bring my technical expertise, collaborative spirit, and drive for continuous improvement to your organization.

Thank you for considering my application. I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to ${company}'s continued success. I look forward to hearing from you.

Sincerely,
${userName || "[Your Name]"}`;
};

// ============================================================
// 6. JOB DESCRIPTION MATCHING
// ============================================================
const demoMatchJob = (messages) => {
  const content = getUserContent(messages);
  const resumeSkills = content.match(/Skills:\s*(.+?)(?:\n|$)/i)?.[1]?.split(",").map((s) => s.trim()) || ["JavaScript", "React", "Node.js"];
  const jdText = content.match(/Job Description:\s*(.+?)(?:\n\nResume:|$)/s)?.[1] || "";

  const commonSkills = ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "AWS", "Docker", "TypeScript", "REST APIs", "MongoDB", "Express"];
  const found = commonSkills.filter((s) => content.toLowerCase().includes(s.toLowerCase()));
  const missing = commonSkills.filter((s) => !content.toLowerCase().includes(s.toLowerCase())).slice(0, 5);

  const matchScore = Math.min(95, 40 + found.length * 8);

  return JSON.stringify({
    matchScore,
    matchedSkills: found.length ? found : resumeSkills.slice(0, 3),
    missingSkills: missing,
    recommendations: [
      `Add ${missing.slice(0, 2).join(" and ")} to your skills section`,
      "Highlight relevant projects that use the required technologies",
      "Quantify your achievements with metrics and impact numbers",
      "Tailor your summary to match the job description keywords",
    ],
    strengths: found.length ? [`Strong match in ${found.slice(0, 3).join(", ")}`] : ["Relevant technical background"],
    gaps: missing.length ? [`Missing keywords: ${missing.join(", ")}`] : ["Consider adding more industry-specific keywords"],
  });
};

// ============================================================
// 7. AI CHAT (returns markdown)
// ============================================================
const demoChat = (messages) => {
  const content = getUserContent(messages);
  const lower = content.toLowerCase();

  if (lower.includes("resume") && (lower.includes("improve") || lower.includes("better"))) {
    return `Here are some actionable tips to improve your resume:

## 1. **Quantify Your Achievements**
Instead of "worked on a project," write "Developed a web app serving 5,000+ users with 99.9% uptime."

## 2. **Use Strong Action Verbs**
Start bullet points with: *Spearheaded, Architected, Optimized, Delivered, Streamlined*

## 3. **Tailor for ATS**
- Use standard section headings (Experience, Education, Skills)
- Include keywords from the job description
- Avoid tables, graphics, and text boxes

## 4. **Keep It Concise**
- 1 page for <5 years experience, 2 pages max otherwise
- Each bullet should be 1-2 lines max

## 5. **Add a Professional Summary**
A 3-4 sentence summary at the top highlighting your key strengths and career goals.

Would you like me to help with a specific section of your resume?`;
  }

  if (lower.includes("interview") || lower.includes("question")) {
    return `Here are some common interview tips:

## **Technical Interviews**
- Practice coding problems on LeetCode/HackerRank
- Explain your thought process out loud
- Ask clarifying questions before coding

## **Behavioral Interviews**
Use the **STAR method**:
- **S**ituation: Set the context
- **T**ask: What was your responsibility
- **A**ction: What you did
- **R**esult: The outcome (quantify if possible)

## **Common Questions to Prepare**
1. "Tell me about yourself"
2. "Why do you want this role?"
3. "Describe a challenging project"
4. "Where do you see yourself in 5 years?"

Would you like me to generate specific interview questions for your role?`;
  }

  if (lower.includes("skill") || lower.includes("learn")) {
    return `Here's my recommendation for skills to develop:

## **High-Demand Technical Skills**
- **JavaScript/TypeScript** - Foundation for web development
- **React/Next.js** - Most popular frontend framework
- **Node.js/Express** - Backend JavaScript
- **Git & GitHub** - Version control essentials
- **Docker** - Containerization

## **Soft Skills That Matter**
- Communication & collaboration
- Problem-solving & analytical thinking
- Time management & adaptability

## **Learning Path**
1. Master one language deeply (JavaScript/Python)
2. Learn a framework (React/Express)
3. Build 3-5 projects for your portfolio
4. Contribute to open source
5. Practice system design

What specific role are you targeting? I can give more tailored advice!`;
  }

  if (lower.includes("project") || lower.includes("portfolio")) {
    return `Here are some impressive project ideas for your portfolio:

## **Full-Stack Projects**
1. **E-commerce Platform** - React + Node.js + MongoDB with payment integration
2. **Social Media App** - Real-time features with Socket.io
3. **Task Management Tool** - Like Trello with drag-and-drop

## **AI/ML Projects**
1. **AI Chatbot** - Using OpenAI API
2. **Resume Analyzer** - ATS scoring system
3. **Sentiment Analyzer** - NLP with Python

## **Tips for Standout Projects**
- Deploy them (Vercel, Netlify, Railway)
- Write clean README with screenshots
- Add live demo links
- Use proper Git workflow with branches

What technologies are you most comfortable with?`;
  }

  // Default response
  return `I'm here to help with your career and resume needs! I can assist with:

- **Resume improvement** - Get tips to make your resume stand out
- **Interview preparation** - Practice questions and strategies
- **Skill recommendations** - Learn what skills are in demand
- **Project ideas** - Build an impressive portfolio
- **Career guidance** - Roadmaps and advice

What would you like help with today?

> **Note:** This is running in demo mode. Add a valid OpenAI API key to \`backend/.env\` for full AI-powered responses.`;
};

// ============================================================
// 8. RESUME REVIEW
// ============================================================
const demoReviewResume = (messages) => {
  const content = getUserContent(messages);
  const hasSummary = /summary:/i.test(content);
  const hasExperience = /experience:/i.test(content);
  const hasSkills = /skills:/i.test(content);
  const hasEducation = /education:/i.test(content);

  return JSON.stringify({
    overallScore: 68,
    grammar: {
      score: 82,
      issues: [
        "Some sentences are too long and could be split for clarity",
        "Inconsistent use of periods at the end of bullet points",
      ],
    },
    formatting: {
      score: 75,
      issues: [
        "Ensure consistent date format throughout (e.g., Jan 2023 - Present)",
        "Use consistent bullet point style",
        "Consider adding more white space between sections",
      ],
    },
    atsCompatibility: {
      score: 65,
      issues: [
        "Avoid using special characters that ATS may not parse",
        "Ensure contact information is in plain text",
        "Use standard section headings",
      ],
    },
    content: {
      score: 60,
      issues: [
        hasExperience ? "Add more quantified achievements in experience section" : "Missing work experience section",
        hasSummary ? "Summary could be more specific to your target role" : "Missing professional summary",
        "Add more action verbs to describe your responsibilities",
      ],
    },
    suggestions: [
      "Quantify your achievements with metrics (e.g., 'Improved performance by 30%')",
      "Tailor your resume for each job application using keywords from the JD",
      "Keep your resume to 1-2 pages maximum",
      hasSkills ? "Organize skills by category (Technical, Tools, Soft Skills)" : "Add a dedicated skills section",
      "Proofread for typos and grammatical errors",
    ],
    strengths: [
      hasExperience ? "Good work experience section" : "Clear structure",
      hasEducation ? "Education section is well-formatted" : "Contact information is complete",
      "Relevant technical skills listed",
    ],
  });
};

// ============================================================
// 9. MOCK INTERVIEW
// ============================================================
const demoMockInterview = (messages) => {
  const sys = getSystemContent(messages);
  const content = getUserContent(messages);
  const roleMatch = sys.match(/interview for a (.+?) position/i) || content.match(/for a (.+?) position/i);
  const role = roleMatch ? roleMatch[1] : "Software Engineer";
  const typeMatch = sys.match(/(technical|behavioral|hr) interview/i);
  const type = typeMatch ? typeMatch[1] : "technical";
  const hasPrevious = content.includes("Previous Q&A");

  const questions = {
    technical: [
      { question: `Can you explain the difference between let, const, and var in JavaScript?`, tips: "Focus on scope, hoisting, and reassignment behavior." },
      { question: `How would you optimize a slow-loading web page?`, tips: "Mention code splitting, lazy loading, caching, and CDN." },
      { question: `Explain the concept of closures in JavaScript with an example.`, tips: "A closure is when a function remembers its outer scope even after the outer function returns." },
      { question: `What is the difference between SQL and NoSQL databases? When would you use each?`, tips: "Discuss structure, scalability, and use cases." },
      { question: `How does the event loop work in Node.js?`, tips: "Explain call stack, callback queue, and event loop interaction." },
    ],
    behavioral: [
      { question: `Tell me about a time you faced a significant challenge in a project. How did you overcome it?`, tips: "Use the STAR method - Situation, Task, Action, Result." },
      { question: `Describe a situation where you had a conflict with a team member. How did you resolve it?`, tips: "Focus on communication, empathy, and finding common ground." },
      { question: `Tell me about a time you failed. What did you learn from it?`, tips: "Show self-awareness and growth mindset." },
      { question: `Describe a project you're most proud of. What was your role?`, tips: "Highlight your specific contributions and impact." },
      { question: `How do you handle tight deadlines and pressure?`, tips: "Discuss prioritization, communication, and staying calm." },
    ],
    hr: [
      { question: `Tell me about yourself.`, tips: "Keep it to 2 minutes - past, present, and future." },
      { question: `Why do you want to work as a ${role}?`, tips: "Connect your passion, skills, and career goals." },
      { question: `Where do you see yourself in 5 years?`, tips: "Show ambition while aligning with the company's growth path." },
      { question: `What are your greatest strengths and weaknesses?`, tips: "Be honest and show how you're improving your weaknesses." },
      { question: `Why should we hire you for this ${role} position?`, tips: "Match your skills to the job requirements." },
    ],
  };

  const pool = questions[type] || questions.technical;
  const index = hasPrevious ? Math.min(pool.length - 1, (content.match(/Q&A/g) || []).length) : 0;
  const q = pool[index];

  return JSON.stringify({
    question: q.question,
    evaluation: hasPrevious ? "Good answer! You demonstrated clear understanding. Let's move to the next question." : null,
    tips: q.tips,
  });
};

// ============================================================
// 10. LINKEDIN HEADLINE
// ============================================================
const demoLinkedinHeadline = (messages) => {
  const content = getUserContent(messages);
  const role = extractField(content, "Role") || "Software Engineer";
  const skillsMatch = content.match(/Skills:\s*(.+?)(?:\n|$)/i);
  const skills = skillsMatch ? skillsMatch[1].split(",").map((s) => s.trim()).slice(0, 3) : ["React", "Node.js"];

  return JSON.stringify({
    headlines: [
      `${role} | ${skills.join(" | ")} | Building scalable web applications`,
      `Passionate ${role} turning ideas into reality with code | ${skills[0]} enthusiast`,
      `${role} & Full-Stack Developer | ${skills.join(", ")} | Open to opportunities`,
      `Aspiring ${role} | Problem Solver | ${skills[0]} | ${skills[1]} | CS Graduate`,
      `${role} | Tech Enthusiast | ${skills.join(" • ")} | Always learning, always growing`,
    ],
  });
};

// ============================================================
// 11. GITHUB README
// ============================================================
const demoGithubReadme = (messages) => {
  const content = getUserContent(messages);
  const projectName = extractField(content, "Project") || "My Project";
  const description = extractField(content, "Description") || "A modern web application built with cutting-edge technologies.";
  const techMatch = content.match(/Tech stack:\s*(.+?)(?:\n|$)/i);
  const techStack = techMatch ? techMatch[1].split(",").map((s) => s.trim()) : ["React", "Node.js", "MongoDB"];
  const featuresMatch = content.match(/Features:\s*(.+?)(?:\n|$)/i);
  const features = featuresMatch ? featuresMatch[1].split(",").map((s) => s.trim()) : ["User authentication", "CRUD operations", "Responsive design"];

  return `# ${projectName}

${description}

## ✨ Features

${features.map((f) => `- ${f}`).join("\n")}

## 🛠️ Tech Stack

${techStack.map((t) => `- ${t}`).join("\n")}

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/${projectName.toLowerCase().replace(/\s+/g, "-")}.git
cd ${projectName.toLowerCase().replace(/\s+/g, "-")}
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Start the development server
\`\`\`bash
npm run dev
\`\`\`

## 📖 Usage

1. Open your browser and navigate to \`http://localhost:5173\`
2. Create an account or log in
3. Start using the application!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)

---

⭐ If you found this project helpful, please give it a star!`;
};

// ============================================================
// 12. CAREER ROADMAP
// ============================================================
const demoCareerRoadmap = (messages) => {
  const content = getUserContent(messages);
  const roleMatch = content.match(/becoming a (.+?)\./i);
  const role = roleMatch ? roleMatch[1] : "Software Engineer";

  return JSON.stringify({
    title: `Roadmap to becoming a ${role}`,
    duration: "6-12 months",
    phases: [
      {
        name: "Phase 1: Fundamentals",
        duration: "1-2 months",
        topics: ["Programming basics", "Data structures", "Algorithms", "Git & GitHub"],
        resources: ["freeCodeCamp", "CS50 by Harvard", "The Odin Project"],
        milestone: "Build your first CLI application and push it to GitHub",
      },
      {
        name: "Phase 2: Core Technologies",
        duration: "2-3 months",
        topics: ["HTML/CSS/JavaScript", "A backend language", "Databases (SQL & NoSQL)", "REST APIs"],
        resources: ["MDN Web Docs", "JavaScript.info", "MongoDB University"],
        milestone: "Build a full-stack CRUD application with authentication",
      },
      {
        name: "Phase 3: Frameworks & Tools",
        duration: "2-3 months",
        topics: ["React/Vue/Angular", "Node.js/Express", "Docker basics", "CI/CD basics"],
        resources: ["React Official Docs", "Node.js Docs", "Docker Getting Started"],
        milestone: "Deploy a project with CI/CD pipeline to cloud",
      },
      {
        name: "Phase 4: Advanced Topics & Job Prep",
        duration: "2-3 months",
        topics: ["System design basics", "DSA practice", "Interview prep", "Open source contribution"],
        resources: ["LeetCode", "System Design Primer", "Tech Interview Handbook"],
        milestone: "Apply to 50+ jobs and crack your first interview",
      },
    ],
    tips: [
      "Build projects consistently - quality over quantity",
      "Contribute to open source to gain real-world experience",
      "Network with developers on LinkedIn and Twitter",
      "Create a portfolio website showcasing your best work",
      "Practice coding interviews regularly on LeetCode",
      "Don't just watch tutorials - build things yourself",
    ],
  });
};

// ============================================================
// 13. INTERVIEW QUESTIONS
// ============================================================
const demoInterviewQuestions = (messages) => {
  const content = getUserContent(messages);
  const roleMatch = content.match(/for a (.+?) position/i);
  const role = roleMatch ? roleMatch[1] : "Software Engineer";
  const typeMatch = content.match(/(\w+)\s+interview/i);
  const type = typeMatch ? typeMatch[1].toLowerCase() : "mixed";

  const allQuestions = [
    { question: `What inspired you to pursue a career as a ${role}?`, type: "behavioral", difficulty: "easy", sampleAnswer: "I've always been passionate about solving problems with technology. Building my first project showed me the impact code can have on people's lives." },
    { question: "Explain the difference between synchronous and asynchronous programming.", type: "technical", difficulty: "medium", sampleAnswer: "Synchronous code executes sequentially, blocking until each operation completes. Asynchronous code allows other operations to continue while waiting, using callbacks, promises, or async/await." },
    { question: "What is the time complexity of binary search and why?", type: "technical", difficulty: "medium", sampleAnswer: "O(log n) because each comparison halves the search space, so the number of steps grows logarithmically with input size." },
    { question: "Describe a challenging bug you encountered and how you debugged it.", type: "behavioral", difficulty: "medium", sampleAnswer: "I encountered a memory leak in a Node.js app. Used profiling tools to identify unclosed database connections, added proper cleanup, and monitored with APM tools." },
    { question: "What is the difference between SQL and NoSQL databases?", type: "technical", difficulty: "easy", sampleAnswer: "SQL databases are relational with fixed schemas and ACID compliance. NoSQL databases are non-relational, flexible schema, and prioritize scalability and performance." },
    { question: "How do you ensure code quality in your projects?", type: "technical", difficulty: "easy", sampleAnswer: "I use linting, code reviews, unit testing, CI/CD pipelines, and follow SOLID principles and design patterns." },
    { question: "Tell me about a time you had to learn a new technology quickly.", type: "behavioral", difficulty: "medium", sampleAnswer: "I had to learn Docker in a week for a project. I read docs, built small examples, and applied it to our project incrementally." },
    { question: "Explain REST API design best practices.", type: "technical", difficulty: "medium", sampleAnswer: "Use proper HTTP methods, meaningful status codes, consistent naming, versioning, pagination, and statelessness. Follow RESTful conventions for resource URLs." },
    { question: "Where do you see yourself in 5 years?", type: "hr", difficulty: "easy", sampleAnswer: "I see myself growing as a senior developer, taking on leadership responsibilities, and contributing to impactful projects while mentoring junior developers." },
    { question: "What are your salary expectations?", type: "hr", difficulty: "medium", sampleAnswer: "Based on my research and experience, I'm looking for a competitive package in the range of X-Y, but I'm open to discussion based on the overall compensation and growth opportunities." },
  ];

  let filtered = allQuestions;
  if (type === "technical") filtered = allQuestions.filter((q) => q.type === "technical");
  else if (type === "behavioral") filtered = allQuestions.filter((q) => q.type === "behavioral");
  else if (type === "hr") filtered = allQuestions.filter((q) => q.type === "hr");

  return JSON.stringify({ questions: filtered });
};

// ============================================================
// 14. GRAMMAR CHECK
// ============================================================
const demoGrammarCheck = (messages) => {
  const content = getUserContent(messages);
  const text = content.trim();

  // Simple grammar improvements
  let corrected = text;
  const issues = [];

  // Check for common issues
  if (/\bi\b/.test(text)) {
    corrected = corrected.replace(/\bi\b/g, "I");
    issues.push({ original: "i", correction: "I", type: "grammar", explanation: "The pronoun 'I' should always be capitalized." });
  }
  if (/\s{2,}/.test(text)) {
    corrected = corrected.replace(/\s{2,}/g, " ");
    issues.push({ original: "double spaces", correction: "single space", type: "style", explanation: "Multiple consecutive spaces should be reduced to a single space." });
  }
  if (/\s+([.,!?;:])/g.test(text)) {
    corrected = corrected.replace(/\s+([.,!?;:])/g, "$1");
    issues.push({ original: "space before punctuation", correction: "no space before punctuation", type: "style", explanation: "There should be no space before punctuation marks." });
  }

  const score = issues.length === 0 ? 95 : Math.max(60, 95 - issues.length * 10);

  return JSON.stringify({
    correctedText: corrected,
    issues: issues.length ? issues : [{ original: "No issues", correction: "No correction needed", type: "style", explanation: "Your text looks good! No major grammar or style issues detected." }],
    score,
  });
};

// ============================================================
// 15. OPTIMIZE KEYWORDS
// ============================================================
const demoOptimizeKeywords = (messages) => {
  const content = getUserContent(messages);
  const jdKeywords = ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "Docker", "REST API", "MongoDB", "Git", "CI/CD", "Agile", "Testing"];

  const present = jdKeywords.filter((k) => content.toLowerCase().includes(k.toLowerCase()));
  const toAdd = jdKeywords.filter((k) => !content.toLowerCase().includes(k.toLowerCase())).slice(0, 6);

  return JSON.stringify({
    keywordsToAdd: toAdd,
    keywordsPresent: present,
    suggestedPlacements: toAdd.slice(0, 4).map((kw) => ({
      keyword: kw,
      section: kw === "AWS" || kw === "Docker" ? "Skills" : kw === "Agile" || kw === "CI/CD" ? "Experience" : "Skills",
      example: `Proficient in ${kw}, applying it in production environments to deliver scalable solutions.`,
    })),
    impact: `Adding these ${toAdd.length} missing keywords could improve your ATS match score by 15-25%. Focus on naturally incorporating them into your skills and experience sections.`,
  });
};

// ============================================================
// 16. PORTFOLIO GENERATOR
// ============================================================
const demoPortfolio = (messages) => {
  const content = getUserContent(messages);
  const name = content.match(/Name:\s*(.+?)(?:\n|$)/i)?.[1] || "Your Name";
  const title = content.match(/Title:\s*(.+?)(?:\n|$)/i)?.[1] || "Software Engineer";
  const skills = content.match(/Skills:\s*(.+?)(?:\n|$)/i)?.[1]?.split(",").map((s) => s.trim()) || ["JavaScript", "React", "Node.js"];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #333; }
    .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 20px; text-align: center; }
    .hero h1 { font-size: 3rem; margin-bottom: 10px; }
    .hero p { font-size: 1.3rem; opacity: 0.9; }
    .container { max-width: 1000px; margin: 0 auto; padding: 60px 20px; }
    .section { margin-bottom: 60px; }
    .section h2 { font-size: 2rem; color: #667eea; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 10px; }
    .skills { display: flex; flex-wrap: wrap; gap: 12px; }
    .skill { background: #f0f0ff; color: #667eea; padding: 10px 20px; border-radius: 25px; font-weight: 600; }
    .card { background: #f9f9f9; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .card h3 { color: #333; margin-bottom: 8px; }
    .contact { text-align: center; background: #333; color: white; padding: 40px 20px; }
    .contact a { color: #667eea; text-decoration: none; margin: 0 15px; }
    @media (max-width: 768px) { .hero h1 { font-size: 2rem; } }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${name}</h1>
    <p>${title}</p>
  </div>
  <div class="container">
    <div class="section">
      <h2>About Me</h2>
      <p>Passionate ${title} dedicated to building innovative solutions. I specialize in creating scalable, user-friendly applications using modern technologies and best practices.</p>
    </div>
    <div class="section">
      <h2>Skills</h2>
      <div class="skills">
        ${skills.map((s) => `<span class="skill">${s}</span>`).join("\n        ")}
      </div>
    </div>
    <div class="section">
      <h2>Projects</h2>
      <div class="card">
        <h3>Project One</h3>
        <p>A brief description of an impressive project you've built.</p>
      </div>
      <div class="card">
        <h3>Project Two</h3>
        <p>Another great project showcasing your skills.</p>
      </div>
    </div>
  </div>
  <div class="contact">
    <h2>Get In Touch</h2>
    <p style="margin-top: 15px;">
      <a href="#">Email</a>
      <a href="#">LinkedIn</a>
      <a href="#">GitHub</a>
    </p>
  </div>
</body>
</html>`;

  return JSON.stringify({
    html,
    sections: ["Hero", "About", "Skills", "Projects", "Contact"],
    colorScheme: "#667eea (Purple gradient)",
    features: ["Responsive design", "Modern gradient hero", "Skill badges", "Project cards", "Contact section"],
  });
};

// ============================================================
// MAIN: Route to appropriate demo generator based on system prompt
// ============================================================
export const generateDemoResponse = (messages, { json = false } = {}) => {
  const sys = getSystemContent(messages).toLowerCase();
  const user = getUserContent(messages).toLowerCase();

  // Detect endpoint based on system prompt keywords
  // Order matters - check most specific patterns first to avoid false matches

  // ATS score checker - system prompt says "You are an ATS (Applicant Tracking System) expert"
  if (sys.includes("applicant tracking system") || sys.includes("ats (applicant")) return demoAtsScore(messages);

  // AI Chat - system prompt says "You are an AI career advisor and resume expert"
  if (sys.includes("ai career advisor") && sys.includes("resume expert")) return demoChat(messages);

  // Cover letter - system prompt says "expert cover letter writer"
  if (sys.includes("cover letter")) return demoCoverLetter(messages);

  // Resume review - system prompt says "professional resume reviewer"
  if (sys.includes("resume reviewer")) return demoReviewResume(messages);

  // Mock interview - system prompt says "interviewer conducting a ... interview"
  if (sys.includes("interviewer") && sys.includes("conducting a")) return demoMockInterview(messages);

  // LinkedIn headline - system prompt says "Generate 5 compelling LinkedIn headlines"
  if (sys.includes("linkedin headline")) return demoLinkedinHeadline(messages);

  // GitHub README - system prompt says "technical writer" and "GitHub README"
  if (sys.includes("technical writer") && sys.includes("readme")) return demoGithubReadme(messages);

  // Career roadmap - system prompt says "career advisor" and "learning roadmap"
  if (sys.includes("career advisor") && sys.includes("roadmap")) return demoCareerRoadmap(messages);

  // Interview questions - system prompt says "Generate interview questions"
  if (sys.includes("interview questions") || sys.includes("generate interview questions")) return demoInterviewQuestions(messages);

  // Grammar check - system prompt says "Check grammar and style"
  if (sys.includes("grammar") && sys.includes("style")) return demoGrammarCheck(messages);

  // Keyword optimizer - system prompt says "Optimize resume keywords"
  if (sys.includes("optimize resume keywords") || sys.includes("keyword")) return demoOptimizeKeywords(messages);

  // Portfolio generator - system prompt says "portfolio website"
  if (sys.includes("portfolio website")) return demoPortfolio(messages);

  // Job description matching - system prompt says "job matching expert"
  if (sys.includes("job matching") || sys.includes("compare a resume")) return demoMatchJob(messages);

  // Skill suggestions - system prompt says "tech career advisor" and "suggest relevant skills"
  if (sys.includes("tech career advisor") || sys.includes("suggest relevant skills")) return demoSuggestSkills(messages);

  // Generate summary - system prompt says "expert resume writer" and user says "Generate a professional resume summary"
  if (sys.includes("expert resume writer") && user.includes("generate a professional resume summary")) return demoGenerateSummary(messages);

  // Improve text - system prompt says "expert resume writer and ATS optimization specialist"
  // Must come AFTER the summary check above
  if (sys.includes("expert resume writer") || sys.includes("ats optimization specialist")) return demoImproveText(messages);

  // Fallback: return a generic helpful response
  if (json) {
    return JSON.stringify({ message: "Demo mode: This feature requires a valid AI API key for full functionality.", demo: true });
  }
  return "This response is generated in demo mode. Add a valid OPENAI_API_KEY to backend/.env to enable full AI-powered responses.";
};

// ============================================================
// DEMO STREAMING (for AI chat)
// ============================================================
export const generateDemoStream = async function* (messages) {
  const response = demoChat(messages);
  // Simulate streaming by yielding word by word
  const words = response.split(" ");
  for (let i = 0; i < words.length; i++) {
    const chunk = i === 0 ? words[i] : " " + words[i];
    yield {
      choices: [{ delta: { content: chunk } }],
    };
    // Small delay to simulate streaming
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
};

export default { generateDemoResponse, generateDemoStream };

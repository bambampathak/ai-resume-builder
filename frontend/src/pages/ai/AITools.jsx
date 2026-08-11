import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Sparkles,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Loader2,
  Award,
  Linkedin,
  Github,
  Map,
  HelpCircle,
  PenTool,
  Search,
  Globe,
  Mic,
  Upload,
  FileUp,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import aiApi from "../../services/aiService.js";
import api from "../../services/api.js";

const tools = [
  { id: "ats", icon: Target, label: "ATS Score Checker", color: "text-green-500" },
  { id: "skills", icon: Sparkles, label: "AI Skill Suggestions", color: "text-purple-500" },
  { id: "coverLetter", icon: FileText, label: "Cover Letter Generator", color: "text-blue-500" },
  { id: "jdMatch", icon: TrendingUp, label: "Job Description Matching", color: "text-orange-500" },
  { id: "review", icon: Search, label: "AI Resume Review", color: "text-indigo-500" },
  { id: "mockInterview", icon: Mic, label: "AI Mock Interview", color: "text-red-500" },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn Headline", color: "text-blue-600" },
  { id: "githubReadme", icon: Github, label: "GitHub README Generator", color: "text-gray-700" },
  { id: "roadmap", icon: Map, label: "AI Career Roadmap", color: "text-teal-500" },
  { id: "questions", icon: HelpCircle, label: "Interview Questions", color: "text-pink-500" },
  { id: "grammar", icon: PenTool, label: "AI Grammar Checker", color: "text-yellow-500" },
  { id: "keywords", icon: Search, label: "Keyword Optimizer", color: "text-cyan-500" },
  { id: "portfolio", icon: Globe, label: "Portfolio Generator", color: "text-violet-500" },
];

export default function AITools() {
  const { t } = useTranslation();
  const [activeTool, setActiveTool] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("nav.aiTools")}</h1>
        <p className="text-gray-500 dark:text-gray-400">AI-powered tools to boost your job search</p>
      </div>

      {!activeTool ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveTool(tool.id)}
              className="card hover:shadow-md transition-shadow text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <tool.icon className={`w-5 h-5 ${tool.color}`} />
              </div>
              <h3 className="font-medium text-sm">{tool.label}</h3>
            </motion.button>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button onClick={() => setActiveTool(null)} className="btn-ghost mb-4 text-sm">← Back to Tools</button>
            {activeTool === "ats" && <ATSChecker />}
            {activeTool === "skills" && <SkillSuggestions />}
            {activeTool === "coverLetter" && <CoverLetter />}
            {activeTool === "jdMatch" && <JDMatch />}
            {activeTool === "review" && <ResumeReview />}
            {activeTool === "mockInterview" && <MockInterview />}
            {activeTool === "linkedin" && <LinkedInHeadline />}
            {activeTool === "githubReadme" && <GitHubReadme />}
            {activeTool === "roadmap" && <CareerRoadmap />}
            {activeTool === "questions" && <InterviewQuestions />}
            {activeTool === "grammar" && <GrammarChecker />}
            {activeTool === "keywords" && <KeywordOptimizer />}
            {activeTool === "portfolio" && <PortfolioGenerator />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ============ Copy Button ============
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="btn-ghost text-sm">
      {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ============ Result Display ============
function ResultBox({ children, title = "Result" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </motion.div>
  );
}

// ============ ATS CHECKER ============
function ATSChecker() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("saved"); // "saved" | "upload"
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    api.get("/resumes").then(({ data }) => setResumes(data.resumes)).catch(() => { });
  }, []);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    const validExt = ["pdf", "doc", "docx"].includes(ext);

    if (!validTypes.includes(selectedFile.type) && !validExt) {
      toast.error("Please upload a PDF, DOC, or DOCX file");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setFile(selectedFile);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleCheck = async () => {
    if (mode === "saved") {
      if (!selectedResume) {
        toast.error("Please select a resume");
        return;
      }
      setLoading(true);
      try {
        const res = await aiApi.atsScore(JSON.parse(selectedResume), jobDesc);
        setResult(res.report);
      } catch (error) {
        toast.error(error.message || "ATS check failed");
      } finally {
        setLoading(false);
      }
    } else {
      if (!file) {
        toast.error("Please upload a resume file");
        return;
      }
      setLoading(true);
      try {
        const res = await aiApi.atsScoreUpload(file, jobDesc);
        setResult(res.report);
      } catch (error) {
        toast.error(error.message || "ATS check failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-green-500" /> ATS Score Checker</h2>

      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
        <button
          onClick={() => { setMode("saved"); setResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${mode === "saved" ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          <FileText className="w-4 h-4" /> Saved Resume
        </button>
        <button
          onClick={() => { setMode("upload"); setResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${mode === "upload" ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          <Upload className="w-4 h-4" /> Upload File
        </button>
      </div>

      <div className="space-y-4">
        {mode === "saved" ? (
          <div>
            <label className="label">Select Resume</label>
            <select className="input" value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}>
              <option value="">Choose a resume...</option>
              {resumes.map((r) => <option key={r._id} value={JSON.stringify(r)}>{r.title}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="label">Upload Resume (PDF / DOC / DOCX)</label>
            {!file ? (
              <label
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg py-8 px-4 cursor-pointer transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600 hover:border-primary"}`}
              >
                <FileUp className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">Drag & drop your resume here, or click to browse</span>
                <span className="text-xs text-gray-400">PDF, DOC, DOCX (max 5MB)</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />
              </label>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <FileText className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => { setFile(null); setResult(null); }}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="label">Job Description (optional)</label>
          <textarea className="input min-h-[100px] resize-y" value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste job description for keyword matching..." />
        </div>
        <button onClick={handleCheck} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Target className="w-4 h-4" /> Check ATS Score</>}
        </button>
      </div>

      {result && (
        <ResultBox title="ATS Analysis">
          <div className="text-center mb-4">
            <div className={`text-5xl font-bold ${result.score >= 70 ? "text-green-500" : result.score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
              {result.score}<span className="text-2xl text-gray-400">/100</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{result.score >= 70 ? "Good ATS compatibility!" : "Needs improvement"}</p>
          </div>
          <div className="space-y-2">
            {result.problems?.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                {issue.type === "error" ? <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> :
                  issue.type === "warning" ? <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" /> :
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
          {result.suggestions?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-sm mb-2">Suggestions:</h4>
              <ul className="space-y-1">
                {result.suggestions.map((s, i) => <li key={i} className="text-sm text-gray-600 dark:text-gray-400">• {s}</li>)}
              </ul>
            </div>
          )}
        </ResultBox>
      )}
    </div>
  );
}

// ============ SKILL SUGGESTIONS ============
function SkillSuggestions() {
  const [role, setRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role.trim()) { toast.error("Enter a role"); return; }
    setLoading(true);
    try {
      // aiApi.suggestSkills already unwraps r.data; result.skills is an object of arrays
      const res = await aiApi.suggestSkills(role, currentSkills.split(",").map(s => s.trim()).filter(Boolean));
      setResult(res.skills || {});
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" /> AI Skill Suggestions</h2>
      <div className="space-y-4">
        <div><label className="label">Target Role</label><input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Frontend Developer" /></div>
        <div><label className="label">Current Skills (comma separated)</label><input className="input" value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)} placeholder="React, JavaScript, HTML" /></div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Suggesting...</> : <><Sparkles className="w-4 h-4" /> Suggest Skills</>}
        </button>
      </div>
      {result && (
        <ResultBox title="Recommended Skills">
          <div className="space-y-3">
            {Object.entries(result).map(([category, skills]) => (
              <div key={category}>
                <strong className="text-sm capitalize">{category}:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skills?.map((s, i) => <span key={i} className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </ResultBox>
      )}
    </div>
  );
}

// ============ COVER LETTER ============
function CoverLetter() {
  const [form, setForm] = useState({
    userName: "",
    company: "",
    role: "",
    experience: "",
    skills: "",
    jobDescription: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleGenerate = async () => {
    const company = form.company.trim();
    const role = form.role.trim();
    if (!company || !role) {
      toast.error("Company and role are required");
      return;
    }

    setLoading(true);
    setResult("");
    try {
      const res = await aiApi.generateCoverLetter({
        userName: form.userName.trim(),
        company,
        role,
        experience: form.experience.trim(),
        skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        jobDescription: form.jobDescription.trim(),
      });
      if (!res?.coverLetter?.trim()) throw new Error("The AI returned an empty cover letter. Please try again.");
      setResult(res.coverLetter.trim());
    } catch (error) {
      toast.error(error.message || "Unable to generate the cover letter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Cover Letter Generator</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="label">Your Name</label><input className="input" value={form.userName} onChange={(e) => updateField("userName", e.target.value)} placeholder="John Doe" /></div>
          <div><label className="label">Company *</label><input className="input" value={form.company} onChange={(e) => updateField("company", e.target.value)} placeholder="Google" required /></div>
        </div>
        <div><label className="label">Role *</label><input className="input" value={form.role} onChange={(e) => updateField("role", e.target.value)} placeholder="Software Engineer" required /></div>
        <div><label className="label">Key Skills (comma separated)</label><input className="input" value={form.skills} onChange={(e) => updateField("skills", e.target.value)} placeholder="React, Node.js, TypeScript" /></div>
        <div><label className="label">Experience / Key Achievements</label><textarea className="input min-h-[100px] resize-y" value={form.experience} onChange={(e) => updateField("experience", e.target.value)} placeholder="3 years in React; increased conversion by 20%; led a team of four..." /></div>
        <div><label className="label">Job Description</label><textarea className="input min-h-[120px] resize-y" value={form.jobDescription} onChange={(e) => updateField("jobDescription", e.target.value)} placeholder="Paste the relevant job description to tailor your cover letter..." /></div>
        <button type="button" onClick={handleGenerate} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><FileText className="w-4 h-4" /> Generate Cover Letter</>}
        </button>
      </div>
      {result && <ResultBox title="Cover Letter"><div className="flex justify-end mb-2"><CopyButton text={result} /></div><p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{result}</p></ResultBox>}
    </div>
  );
}

// ============ JD MATCH ============
function JDMatch() {
  const [jd, setJd] = useState("");
  const [resumeData, setResumeData] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!jd.trim()) { toast.error("Paste a job description"); return; }
    setLoading(true);
    try {
      let parsed = {};
      try { parsed = JSON.parse(resumeData); } catch { parsed = { skills: resumeData.split(",").map(s => s.trim()), personalInfo: { summary: resumeData } }; }
      const res = await aiApi.matchJobDescription(jd, parsed);
      setResult(res.match);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-orange-500" /> Job Description Matching</h2>
      <div className="space-y-4">
        <div><label className="label">Paste Job Description</label><textarea className="input min-h-[120px] resize-y" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the full job description here..." /></div>
        <div><label className="label">Your Skills (comma separated) or Resume JSON</label><textarea className="input min-h-[80px] resize-y" value={resumeData} onChange={(e) => setResumeData(e.target.value)} placeholder="React, Node.js, MongoDB..." /></div>
        <button onClick={handleMatch} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Matching...</> : <><TrendingUp className="w-4 h-4" /> Check Match</>}
        </button>
      </div>
      {result && (
        <ResultBox title="Match Analysis">
          <div className="text-center mb-4">
            <div className={`text-5xl font-bold ${result.matchScore >= 70 ? "text-green-500" : result.matchScore >= 50 ? "text-yellow-500" : "text-red-500"}`}>{result.matchScore}%</div>
            <p className="text-sm text-gray-500 mt-1">Match Score</p>
          </div>
          {result.matchedSkills?.length > 0 && (
            <div className="mb-3"><h4 className="text-sm font-medium mb-1">✅ Matched Skills:</h4><div className="flex flex-wrap gap-1">{result.matchedSkills.map((s, i) => <span key={i} className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">{s}</span>)}</div></div>
          )}
          {result.missingSkills?.length > 0 && (
            <div><h4 className="text-sm font-medium mb-1">❌ Missing Skills:</h4><div className="flex flex-wrap gap-1">{result.missingSkills.map((s, i) => <span key={i} className="badge bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">{s}</span>)}</div></div>
          )}
        </ResultBox>
      )}
    </div>
  );
}

// ============ RESUME REVIEW ============
function ResumeReview() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!text.trim()) { toast.error("Paste your resume text"); return; }
    setLoading(true);
    try {
      const res = await aiApi.reviewResume(text);
      setResult(res.review);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-indigo-500" /> AI Resume Review</h2>
      <div className="space-y-4">
        <div><label className="label">Paste Resume Text</label><textarea className="input min-h-[150px] resize-y" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your full resume text here..." /></div>
        <button onClick={handleReview} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Reviewing...</> : <><Search className="w-4 h-4" /> Review Resume</>}
        </button>
      </div>
      {result && (
        <ResultBox title="AI Review">
          <div className="space-y-3">
            <div className="text-center mb-3">
              <div className={`text-4xl font-bold ${result.overallScore >= 70 ? "text-green-500" : result.overallScore >= 50 ? "text-yellow-500" : "text-red-500"}`}>{result.overallScore}<span className="text-xl text-gray-400">/100</span></div>
              <p className="text-sm text-gray-500">Overall Score</p>
            </div>
            {["grammar", "formatting", "atsCompatibility", "content"].map((cat) => (
              <div key={cat}>
                <div className="flex items-center justify-between">
                  <strong className="text-sm capitalize">{cat}</strong>
                  <span className={`text-sm font-medium ${result[cat]?.score >= 70 ? "text-green-500" : result[cat]?.score >= 50 ? "text-yellow-500" : "text-red-500"}`}>{result[cat]?.score}/100</span>
                </div>
                {result[cat]?.issues?.length > 0 && (
                  <ul className="mt-1 space-y-1">{result[cat].issues.map((issue, i) => <li key={i} className="text-sm text-gray-600 dark:text-gray-400">• {issue}</li>)}</ul>
                )}
              </div>
            ))}
            {result.suggestions?.length > 0 && (
              <div><strong className="text-sm">Suggestions:</strong><ul className="mt-1 space-y-1">{result.suggestions.map((s, i) => <li key={i} className="text-sm text-gray-600 dark:text-gray-400">• {s}</li>)}</ul></div>
            )}
          </div>
        </ResultBox>
      )}
    </div>
  );
}

// ============ MOCK INTERVIEW ============
function MockInterview() {
  const [role, setRole] = useState("");
  const [type, setType] = useState("technical");
  const [qa, setQa] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!role.trim()) { toast.error("Enter a role"); return; }
    setLoading(true);
    try {
      const res = await aiApi.mockInterview(role, type, qa);
      setQa([...qa, { question: res.interview.question, answer: "" }]);
      setCurrentAnswer("");
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  const handleSubmitAnswer = async (index) => {
    const updated = [...qa];
    updated[index].answer = currentAnswer;
    setQa(updated);
    setLoading(true);
    try {
      const res = await aiApi.mockInterview(role, type, updated);
      setQa([...updated, { question: res.interview.question, answer: "" }]);
      setCurrentAnswer("");
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Mic className="w-5 h-5 text-red-500" /> AI Mock Interview</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Role</label><input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer" /></div>
          <div><label className="label">Type</label><select className="input" value={type} onChange={(e) => setType(e.target.value)}><option value="technical">Technical</option><option value="behavioral">Behavioral</option><option value="hr">HR</option><option value="mixed">Mixed</option></select></div>
        </div>
        <button onClick={handleStart} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</> : <><Mic className="w-4 h-4" /> {qa.length === 0 ? "Start Interview" : "Next Question"}</>}
        </button>
      </div>
      {qa.length > 0 && (
        <div className="mt-4 space-y-4">
          {qa.map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-sm font-medium mb-2">Q{i + 1}: {item.question}</p>
              {item.answer ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">A: {item.answer}</p>
              ) : (
                <div className="space-y-2">
                  <textarea className="input min-h-[60px] resize-y" value={i === qa.length - 1 ? currentAnswer : ""} onChange={(e) => setCurrentAnswer(e.target.value)} placeholder="Type your answer..." />
                  {i === qa.length - 1 && <button onClick={() => handleSubmitAnswer(i)} className="btn-secondary text-sm">Submit Answer</button>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ LINKEDIN HEADLINE ============
function LinkedInHeadline() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role.trim()) { toast.error("Enter a role"); return; }
    setLoading(true);
    try {
      const res = await aiApi.linkedinHeadline(role, skills.split(",").map(s => s.trim()).filter(Boolean), experience);
      setResult(res.headlines);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Linkedin className="w-5 h-5 text-blue-600" /> LinkedIn Headline Generator</h2>
      <div className="space-y-4">
        <div><label className="label">Role</label><input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Full Stack Developer" /></div>
        <div><label className="label">Skills (comma separated)</label><input className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, AWS" /></div>
        <div><label className="label">Experience Summary</label><input className="input" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="3 years building web apps" /></div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Linkedin className="w-4 h-4" /> Generate</>}
        </button>
      </div>
      {result && (
        <ResultBox title="LinkedIn Headlines">
          <div className="flex justify-end mb-2"><CopyButton text={result?.join("\n")} /></div>
          <div className="space-y-2">{result?.map((h, i) => <p key={i} className="text-sm p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">{h}</p>)}</div>
        </ResultBox>
      )}
    </div>
  );
}

// ============ GITHUB README ============
function GitHubReadme() {
  const [form, setForm] = useState({ projectName: "", description: "", techStack: "", features: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!form.projectName) { toast.error("Enter project name"); return; }
    setLoading(true);
    try {
      const res = await aiApi.githubReadme(form);
      setResult(res.readme);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Github className="w-5 h-5" /> GitHub README Generator</h2>
      <div className="space-y-4">
        <div><label className="label">Project Name</label><input className="input" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} /></div>
        <div><label className="label">Description</label><textarea className="input min-h-[60px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div><label className="label">Tech Stack</label><input className="input" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="React, Node.js, MongoDB" /></div>
        <div><label className="label">Features</label><textarea className="input min-h-[60px] resize-y" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="User auth, CRUD, real-time updates..." /></div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Github className="w-4 h-4" /> Generate README</>}
        </button>
      </div>
      {result && <ResultBox title="README.md"><div className="flex justify-end mb-2"><CopyButton text={result} /></div><pre className="text-xs whitespace-pre-wrap text-gray-700 dark:text-gray-300 overflow-x-auto">{result}</pre></ResultBox>}
    </div>
  );
}

// ============ CAREER ROADMAP ============
function CareerRoadmap() {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("beginner");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role.trim()) { toast.error("Enter a role"); return; }
    setLoading(true);
    try {
      const res = await aiApi.careerRoadmap(role, level, goal);
      setResult(res.roadmap);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Map className="w-5 h-5 text-teal-500" /> AI Career Roadmap</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Target Role</label><input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Developer" /></div>
          <div><label className="label">Current Level</label><select className="input" value={level} onChange={(e) => setLevel(e.target.value)}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
        </div>
        <div><label className="label">Goal (optional)</label><input className="input" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Land a FAANG job" /></div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating roadmap...</> : <><Map className="w-4 h-4" /> Generate Roadmap</>}
        </button>
      </div>
      {result && (
        <ResultBox title={result.title || "Your Career Roadmap"}>
          {result.duration && <p className="text-sm text-gray-500 mb-3">⏱ {result.duration}</p>}
          <div className="space-y-3">
            {result.phases?.map((phase, i) => (
              <div key={i} className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{phase.name || `Phase ${i + 1}`}</h4>
                  {phase.duration && <span className="text-xs text-gray-400">{phase.duration}</span>}
                </div>
                {phase.topics?.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{phase.topics.map((s, j) => <span key={j} className="badge bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs">{s}</span>)}</div>}
                {phase.milestone && <p className="text-xs text-gray-500 mt-2">🎯 {phase.milestone}</p>}
              </div>
            ))}
          </div>
          {result.tips?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-sm mb-2">Tips:</h4>
              <ul className="space-y-1">{result.tips.map((tip, i) => <li key={i} className="text-sm text-gray-600 dark:text-gray-400">• {tip}</li>)}</ul>
            </div>
          )}
        </ResultBox>
      )}
    </div>
  );
}

// ============ INTERVIEW QUESTIONS ============
function InterviewQuestions() {
  const [role, setRole] = useState("");
  const [type, setType] = useState("mixed");
  const [count, setCount] = useState(10);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role.trim()) { toast.error("Enter a role"); return; }
    setLoading(true);
    try {
      const res = await aiApi.interviewQuestions(role, type, count);
      setResult(res.questions);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-pink-500" /> Interview Question Generator</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="label">Role</label><input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="React Developer" /></div>
          <div><label className="label">Type</label><select className="input" value={type} onChange={(e) => setType(e.target.value)}><option value="technical">Technical</option><option value="behavioral">Behavioral</option><option value="hr">HR</option><option value="mixed">Mixed</option></select></div>
          <div><label className="label">Count</label><input type="number" min="5" max="30" className="input" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 10)} /></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><HelpCircle className="w-4 h-4" /> Generate Questions</>}
        </button>
      </div>
      {result && (
        <ResultBox title="Interview Questions">
          <div className="flex justify-end mb-2"><CopyButton text={result?.map((q, i) => `${i + 1}. ${q.question || q}`).join("\n")} /></div>
          <div className="space-y-2">{result?.map((q, i) => (
            <div key={i} className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm"><strong>{i + 1}.</strong> {q.question || q}</p>
                {q.difficulty && <span className="badge bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs shrink-0">{q.difficulty}</span>}
              </div>
              {q.sampleAnswer && <p className="text-xs text-gray-500 mt-1">💡 {q.sampleAnswer}</p>}
            </div>
          ))}</div>
        </ResultBox>
      )}
    </div>
  );
}

// ============ GRAMMAR CHECKER ============
function GrammarChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!text.trim()) { toast.error("Enter text to check"); return; }
    setLoading(true);
    try {
      const res = await aiApi.grammarCheck(text);
      setResult(res.result);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><PenTool className="w-5 h-5 text-yellow-500" /> AI Grammar Checker</h2>
      <div className="space-y-4">
        <div><label className="label">Text to Check</label><textarea className="input min-h-[120px] resize-y" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here..." /></div>
        <button onClick={handleCheck} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</> : <><PenTool className="w-4 h-4" /> Check Grammar</>}
        </button>
      </div>
      {result && (
        <ResultBox title="Grammar Check Results">
          <div className="space-y-3">
            {result.score != null && (
              <div className="text-center mb-3">
                <span className={`text-2xl font-bold ${result.score >= 80 ? "text-green-500" : result.score >= 60 ? "text-yellow-500" : "text-red-500"}`}>{result.score}/100</span>
              </div>
            )}
            {result.correctedText && <div><strong className="text-sm">Corrected:</strong><p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{result.correctedText}</p></div>}
            {result.issues?.length > 0 && (
              <div><strong className="text-sm">Issues Found:</strong><ul className="mt-1 space-y-2">{result.issues.map((issue, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="line-through text-red-400">{issue.original}</span> → <span className="text-green-500">{issue.correction}</span>
                  <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs ml-1">{issue.type}</span>
                  {issue.explanation && <p className="text-xs text-gray-400 mt-0.5">{issue.explanation}</p>}
                </li>
              ))}</ul></div>
            )}
            {!result.issues?.length && <p className="text-sm text-green-500">✓ No grammar issues found!</p>}
          </div>
        </ResultBox>
      )}
    </div>
  );
}

// ============ KEYWORD OPTIMIZER ============
function KeywordOptimizer() {
  const [jd, setJd] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    if (!jd.trim()) { toast.error("Paste a job description"); return; }
    setLoading(true);
    try {
      const res = await aiApi.optimizeKeywords({ skills: skills.split(",").map(s => s.trim()) }, jd);
      setResult(res.optimization);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-cyan-500" /> Resume Keyword Optimizer</h2>
      <div className="space-y-4">
        <div><label className="label">Job Description</label><textarea className="input min-h-[100px] resize-y" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste JD here..." /></div>
        <div><label className="label">Your Current Skills</label><input className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js..." /></div>
        <button onClick={handleOptimize} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Optimizing...</> : <><Search className="w-4 h-4" /> Optimize Keywords</>}
        </button>
      </div>
      {result && (
        <ResultBox title="Keyword Optimization">
          <div className="space-y-3">
            {result.keywordsPresent?.length > 0 && <div><strong className="text-sm">Keywords Present:</strong><div className="flex flex-wrap gap-1 mt-1">{result.keywordsPresent.map((k, i) => <span key={i} className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">{k}</span>)}</div></div>}
            {result.keywordsToAdd?.length > 0 && <div><strong className="text-sm">Add These Keywords:</strong><div className="flex flex-wrap gap-1 mt-1">{result.keywordsToAdd.map((k, i) => <span key={i} className="badge bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">{k}</span>)}</div></div>}
            {result.suggestedPlacements?.length > 0 && (
              <div><strong className="text-sm">Suggested Placements:</strong><ul className="mt-1 space-y-1">{result.suggestedPlacements.map((p, i) => <li key={i} className="text-sm text-gray-600 dark:text-gray-400">• <strong>{p.keyword}</strong> in {p.section}: <em>{p.example}</em></li>)}</ul></div>
            )}
            {result.impact && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">📊 {result.impact}</p>}
          </div>
        </ResultBox>
      )}
    </div>
  );
}

// ============ PORTFOLIO GENERATOR ============
function PortfolioGenerator() {
  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/resumes").then(({ data }) => setResumes(data.resumes)).catch(() => { });
  }, []);

  const handleGenerate = async () => {
    if (!selected) { toast.error("Select a resume"); return; }
    setLoading(true);
    try {
      const res = await aiApi.generatePortfolio(JSON.parse(selected));
      setResult(res.portfolio);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-violet-500" /> AI Portfolio Generator</h2>
      <div className="space-y-4">
        <div><label className="label">Select Resume</label><select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}><option value="">Choose...</option>{resumes.map((r) => <option key={r._id} value={JSON.stringify(r)}>{r.title}</option>)}</select></div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Globe className="w-4 h-4" /> Generate Portfolio</>}
        </button>
      </div>
      {result && (
        <ResultBox title="Portfolio Content">
          <div className="flex justify-end mb-2"><CopyButton text={result.html || JSON.stringify(result, null, 2)} /></div>
          {result.html ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {result.colorScheme && <span className="badge bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">🎨 {result.colorScheme}</span>}
                {result.sections?.map((s, i) => <span key={i} className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">{s}</span>)}
              </div>
              <details className="mt-2">
                <summary className="text-sm cursor-pointer text-violet-500">View HTML code</summary>
                <pre className="text-xs whitespace-pre-wrap text-gray-700 dark:text-gray-300 overflow-x-auto mt-2 p-2 rounded bg-gray-100 dark:bg-gray-900">{result.html}</pre>
              </details>
            </div>
          ) : (
            <pre className="text-xs whitespace-pre-wrap text-gray-700 dark:text-gray-300 overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
          )}
        </ResultBox>
      )}
    </div>
  );
}

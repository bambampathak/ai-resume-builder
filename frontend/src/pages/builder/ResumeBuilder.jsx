import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Eye,
  Edit3,
  Palette,
  Loader2,
  History,
  Target,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../../components/ui/Loader.jsx";
import ResumePreview from "../../components/resume/ResumePreview.jsx";
import AIAssistModal from "../../components/resume/AIAssistModal.jsx";
import { downloadResumePDF } from "../../utils/pdfGenerator.js";
import {
  defaultResumeData,
  emptyEducation,
  emptyExperience,
  emptyProject,
  emptyCertification,
  templates,
} from "../../utils/defaultResume.js";

const sections = [
  { id: "personal", label: "Personal Info", icon: Edit3 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code },
  { id: "projects", label: "Projects", icon: FolderGit },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "interests", label: "Interests", icon: Heart },
  { id: "personalDetails", label: "Personal Details", icon: User },
  { id: "template", label: "Template", icon: Palette },
];

// Icon imports
import { Briefcase, GraduationCap, Code, FolderGit, Award, Languages, Heart, User } from "lucide-react";

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");
  const autoSaveTimer = useRef(null);
  const lastSavedResume = useRef("");
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [activeSection, setActiveSection] = useState("personal");
  const [collapsed, setCollapsed] = useState({});
  const [aiModal, setAIModal] = useState({ open: false, type: "", field: null, index: null, currentText: "", context: "" });
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    if (id) {
      fetchResume();
    } else {
      const newResume = { ...defaultResumeData, personalInfo: { ...defaultResumeData.personalInfo, fullName: user?.name || "" } };
      lastSavedResume.current = JSON.stringify(newResume);
      setResume(newResume);
      setLoading(false);
    }

    return () => clearTimeout(autoSaveTimer.current);
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      const previewWidth = window.innerWidth > 1024 ? window.innerWidth - 580 : window.innerWidth - 48;
      setScale(Math.min(0.7, previewWidth / 794));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await api.get(`/resumes/${id}`);
      lastSavedResume.current = JSON.stringify(data.resume);
      setResume(data.resume);
      setAutoSaveStatus("saved");
    } catch (error) {
      toast.error("Failed to load resume");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!resume || loading) return;

    const serializedResume = JSON.stringify(resume);
    if (serializedResume === lastSavedResume.current) return;

    setAutoSaveStatus("pending");
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setAutoSaveStatus("saving");
      try {
        if (id) {
          await api.put(`/resumes/${id}`, resume);
          lastSavedResume.current = serializedResume;
        } else {
          const { data } = await api.post("/resumes", resume);
          lastSavedResume.current = serializedResume;
          navigate(`/builder/${data.resume._id}`, { replace: true });
        }
        setAutoSaveStatus("saved");
      } catch (error) {
        setAutoSaveStatus("error");
        toast.error("Auto-save failed");
      }
    }, 1500);

    return () => clearTimeout(autoSaveTimer.current);
  }, [resume, id, loading, navigate]);

  const handleSave = async () => {
    clearTimeout(autoSaveTimer.current);
    setSaving(true);
    try {
      if (id) {
        await api.put(`/resumes/${id}`, resume);
      } else {
        const { data } = await api.post("/resumes", resume);
        navigate(`/builder/${data.resume._id}`, { replace: true });
      }
      lastSavedResume.current = JSON.stringify(resume);
      setAutoSaveStatus("saved");
      toast.success("Resume saved!");
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVersion = async () => {
    if (!id) return;
    try {
      await api.post(`/resumes/${id}/versions`);
      toast.success("Version saved!");
    } catch (error) {
      toast.error("Failed to save version");
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadResumePDF("resume-preview", `${resume.title || "resume"}.pdf`);
      if (id) {
        await api.post(`/resumes/${id}/download`);
      }
      toast.success("PDF downloaded!");
    } catch (error) {
      toast.error("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const updateField = (path, value) => {
    setResume((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = [...(obj[keys[i]] || [])];
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updatePersonalInfo = (field, value) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updatePersonalDetails = (field, value) => {
    setResume((prev) => ({
      ...prev,
      personalDetails: { ...(prev.personalDetails || {}), [field]: value },
    }));
  };

  const addArrayItem = (section, emptyItem) => {
    setResume((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), emptyItem()],
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const removeArrayItem = (section, index) => {
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const activeSectionIndex = sections.findIndex((section) => section.id === activeSection);
  const isLastSection = activeSectionIndex === sections.length - 1;

  const goToNextSection = () => {
    if (isLastSection) {
      setActiveTab("preview");
      return;
    }

    setActiveSection(sections[activeSectionIndex + 1].id);
    document.getElementById("builder-form")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAI = (type, field, index, currentText, context = "") => {
    setAIModal({ open: true, type, field, index, currentText, context });
  };

  const applyAI = (result) => {
    const { field, index } = aiModal;
    if (field === "summary") {
      updatePersonalInfo("summary", result);
    } else if (field === "skills") {
      // AI returns a comma-separated list of suggested skills; merge unique ones
      const suggested = result
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const existing = resume.skills || [];
      const merged = [...new Set([...existing, ...suggested])];
      updateField("skills", merged);
    } else if (index !== null) {
      updateArrayItem(field, index, "description", result);
    }
    toast.success("AI suggestion applied!");
  };

  if (loading) return <Loader fullScreen />;
  if (!resume) return null;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          value={resume.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
          className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 px-0 max-w-xs"
          placeholder="Resume Title"
        />
        <div className="flex items-center gap-2">
          <span className={`hidden sm:inline text-xs ${autoSaveStatus === "error" ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
            {autoSaveStatus === "saving" && "Saving..."}
            {autoSaveStatus === "pending" && "Unsaved changes"}
            {autoSaveStatus === "saved" && "All changes saved"}
            {autoSaveStatus === "error" && "Auto-save failed"}
          </span>
          {id && (
            <button onClick={handleSaveVersion} className="btn-ghost" title="Save Version">
              <History className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="btn-secondary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t("common.save")}
          </button>
          <button onClick={handleDownload} disabled={downloading} className="btn-primary">
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {t("builder.download")}
          </button>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "edit" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Edit3 className="w-4 h-4" /> {t("builder.preview") === "प्रीव्यू" ? "Edit" : "Edit"}
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "preview" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Eye className="w-4 h-4" /> {t("builder.preview")}
        </button>
      </div>

      <div className={`grid gap-6 ${activeTab === "edit" ? "lg:grid-cols-2" : ""}`}>
        {/* Edit Panel */}
        {activeTab === "edit" && (
          <div className="space-y-3">
            {/* Section tabs */}
            <div className="flex flex-wrap gap-1.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeSection === s.id
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              ))}
            </div>

            <div id="builder-form" className="card max-h-[calc(100vh-280px)] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeSection === "personal" && (
                    <PersonalInfoForm data={resume.personalInfo} update={updatePersonalInfo} openAI={openAI} />
                  )}
                  {activeSection === "experience" && (
                    <ExperienceForm items={resume.experience} add={() => addArrayItem("experience", emptyExperience)} update={updateArrayItem} remove={removeArrayItem} openAI={openAI} />
                  )}
                  {activeSection === "education" && (
                    <EducationForm items={resume.education} add={() => addArrayItem("education", emptyEducation)} update={updateArrayItem} remove={removeArrayItem} />
                  )}
                  {activeSection === "skills" && (
                    <SkillsForm skills={resume.skills} update={(skills) => updateField("skills", skills)} openAI={openAI} />
                  )}
                  {activeSection === "projects" && (
                    <ProjectsForm items={resume.projects} add={() => addArrayItem("projects", emptyProject)} update={updateArrayItem} remove={removeArrayItem} openAI={openAI} />
                  )}
                  {activeSection === "certifications" && (
                    <CertificationsForm items={resume.certifications} add={() => addArrayItem("certifications", emptyCertification)} update={updateArrayItem} remove={removeArrayItem} />
                  )}
                  {activeSection === "languages" && (
                    <LanguagesForm languages={resume.languages} update={(languages) => updateField("languages", languages)} />
                  )}
                  {activeSection === "interests" && (
                    <InterestsForm interests={resume.interests} update={(interests) => updateField("interests", interests)} />
                  )}
                  {activeSection === "personalDetails" && (
                    <PersonalDetailsForm data={resume.personalDetails || {}} update={updatePersonalDetails} />
                  )}
                  {activeSection === "template" && (
                    <TemplateForm resume={resume} update={updateField} />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={goToNextSection} className="btn-primary">
                  {isLastSection ? <Eye className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  {isLastSection ? "Preview Resume" : "Next Details"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        <div className={`${activeTab === "preview" ? "" : "hidden lg:block"}`}>
          <div className="sticky top-20 overflow-x-auto bg-gray-100 dark:bg-gray-900 rounded-xl p-4">
            <div id="resume-preview-wrapper" style={{ width: "fit-content", margin: "0 auto" }}>
              <ResumePreview data={resume} scale={activeTab === "preview" ? Math.min(0.85, (window.innerWidth - 100) / 794) : scale} />
            </div>
          </div>
        </div>
      </div>

      <AIAssistModal
        isOpen={aiModal.open}
        onClose={() => setAIModal({ ...aiModal, open: false })}
        onApply={applyAI}
        type={aiModal.type}
        currentText={aiModal.currentText}
        context={aiModal.context}
      />
    </div>
  );
}

// ============ HELPERS ============
const titleCase = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());
const handleTitleCase = (updateFn, ...args) => (e) => {
  const val = titleCase(e.target.value);
  updateFn(...args, val);
};

// ============ FORM COMPONENTS ============

function PersonalInfoForm({ data, update, openAI }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label">Full Name</label><input className="input" value={data.fullName || ""} onChange={handleTitleCase(update, "fullName")} placeholder="John Doe" /></div>
        <div><label className="label">Job Title</label><input className="input" value={data.jobTitle || ""} onChange={handleTitleCase(update, "jobTitle")} placeholder="Software Engineer" /></div>
        <div><label className="label">Email</label><input className="input" value={data.email || ""} onChange={(e) => update("email", e.target.value.toLowerCase())} placeholder="john@example.com" /></div>
        <div><label className="label">Phone</label><input className="input" value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} placeholder="+1 234 567 890" /></div>
        <div><label className="label">Location</label><input className="input" value={data.location || ""} onChange={handleTitleCase(update, "location")} placeholder="City, Country" /></div>
        <div><label className="label">Website</label><input className="input" value={data.website || ""} onChange={(e) => update("website", e.target.value)} placeholder="yoursite.com" /></div>
        <div><label className="label">LinkedIn</label><input className="input" value={data.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} placeholder="linkedin.com/in/username" /></div>
        <div><label className="label">GitHub</label><input className="input" value={data.github || ""} onChange={(e) => update("github", e.target.value)} placeholder="github.com/username" /></div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label mb-0">Summary</label>
          <button onClick={() => openAI("summary", "summary", null, data.summary || "", data.jobTitle)} className="text-xs text-purple-600 hover:underline flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Generate
          </button>
        </div>
        <textarea className="input min-h-[100px] resize-y" value={data.summary || ""} onChange={(e) => update("summary", e.target.value)} placeholder="Professional summary..." />
      </div>
    </div>
  );
}

function ExperienceForm({ items, add, update, remove, openAI }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Experience {i + 1}</span>
            <button onClick={() => remove("experience", i)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Position</label><input className="input" value={item.position || ""} onChange={handleTitleCase(update, "experience", i, "position")} placeholder="Software Engineer" /></div>
            <div><label className="label">Company</label><input className="input" value={item.company || ""} onChange={handleTitleCase(update, "experience", i, "company")} placeholder="Company Inc." /></div>
            <div><label className="label">Location</label><input className="input" value={item.location || ""} onChange={handleTitleCase(update, "experience", i, "location")} placeholder="Remote" /></div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" checked={item.current || false} onChange={(e) => update("experience", i, "current", e.target.checked)} className="rounded" />
                Current
              </label>
            </div>
            <div><label className="label">Start Date</label><input type="month" className="input" value={item.startDate || ""} onChange={(e) => update("experience", i, "startDate", e.target.value)} /></div>
            <div><label className="label">End Date</label><input type="month" className="input" value={item.endDate || ""} onChange={(e) => update("experience", i, "endDate", e.target.value)} disabled={item.current} /></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Description</label>
              <button onClick={() => openAI("experience", "experience", i, item.description || "", `${item.position} at ${item.company}`)} className="text-xs text-purple-600 hover:underline flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Improve
              </button>
            </div>
            <textarea className="input min-h-[80px] resize-y" value={item.description || ""} onChange={(e) => update("experience", i, "description", e.target.value)} placeholder="Describe your responsibilities and achievements..." />
          </div>
        </div>
      ))}
      <button onClick={add} className="btn-secondary w-full"><Plus className="w-4 h-4" /> {t("builder.add")} {t("builder.experience")}</button>
    </div>
  );
}

function EducationForm({ items, add, update, remove }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Education {i + 1}</span>
            <button onClick={() => remove("education", i)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Institution</label><input className="input" value={item.institution || ""} onChange={handleTitleCase(update, "education", i, "institution")} placeholder="University Name" /></div>
            <div><label className="label">Degree</label><input className="input" value={item.degree || ""} onChange={handleTitleCase(update, "education", i, "degree")} placeholder="B.Tech" /></div>
            <div><label className="label">Field</label><input className="input" value={item.field || ""} onChange={handleTitleCase(update, "education", i, "field")} placeholder="Computer Science" /></div>
            <div><label className="label">Grade/GPA</label><input className="input" value={item.grade || ""} onChange={(e) => update("education", i, "grade", e.target.value)} placeholder="8.5 CGPA" /></div>
            <div><label className="label">Start Date</label><input type="month" className="input" value={item.startDate || ""} onChange={(e) => update("education", i, "startDate", e.target.value)} /></div>
            <div><label className="label">End Date</label><input type="month" className="input" value={item.endDate || ""} onChange={(e) => update("education", i, "endDate", e.target.value)} /></div>
          </div>
          <div><label className="label">Description</label><textarea className="input min-h-[60px] resize-y" value={item.description || ""} onChange={(e) => update("education", i, "description", e.target.value)} placeholder="Relevant coursework, achievements..." /></div>
        </div>
      ))}
      <button onClick={add} className="btn-secondary w-full"><Plus className="w-4 h-4" /> {t("builder.add")} {t("builder.education")}</button>
    </div>
  );
}

function SkillsForm({ skills, update, openAI }) {
  const [input, setInput] = useState("");
  const { t } = useTranslation();

  const addSkill = () => {
    if (input.trim() && !skills.includes(input.trim())) {
      update([...skills, input.trim()]);
      setInput("");
    }
  };

  const removeSkill = (skill) => update(skills.filter((s) => s !== skill));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          placeholder="Add a skill..."
        />
        <button onClick={addSkill} className="btn-primary shrink-0"><Plus className="w-4 h-4" /></button>
      </div>
      <button onClick={() => openAI("skill", "skills", null, skills.join(", "), "")} className="text-sm text-purple-600 hover:underline flex items-center gap-1">
        <Sparkles className="w-4 h-4" /> AI Suggest Skills
      </button>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm">
            {skill}
            <button onClick={() => removeSkill(skill)} className="hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
          </span>
        ))}
        {skills.length === 0 && <p className="text-sm text-gray-400">No skills added yet</p>}
      </div>
    </div>
  );
}

function ProjectsForm({ items, add, update, remove, openAI }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Project {i + 1}</span>
            <button onClick={() => remove("projects", i)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Name</label><input className="input" value={item.name || ""} onChange={(e) => update("projects", i, "name", e.target.value)} placeholder="Project Name" /></div>
            <div><label className="label">Tech Stack</label><input className="input" value={item.techStack || ""} onChange={(e) => update("projects", i, "techStack", e.target.value)} placeholder="React, Node.js" /></div>
            <div className="col-span-2"><label className="label">Link</label><input className="input" value={item.link || ""} onChange={(e) => update("projects", i, "link", e.target.value)} placeholder="github.com/..." /></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Description</label>
              <button onClick={() => openAI("project", "projects", i, item.description || "", item.name)} className="text-xs text-purple-600 hover:underline flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Improve
              </button>
            </div>
            <textarea className="input min-h-[80px] resize-y" value={item.description || ""} onChange={(e) => update("projects", i, "description", e.target.value)} placeholder="Describe the project..." />
          </div>
        </div>
      ))}
      <button onClick={add} className="btn-secondary w-full"><Plus className="w-4 h-4" /> {t("builder.add")} {t("builder.projects")}</button>
    </div>
  );
}

function CertificationsForm({ items, add, update, remove }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Certification {i + 1}</span>
            <button onClick={() => remove("certifications", i)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Name</label><input className="input" value={item.name || ""} onChange={(e) => update("certifications", i, "name", e.target.value)} placeholder="AWS Certified" /></div>
            <div><label className="label">Issuer</label><input className="input" value={item.issuer || ""} onChange={(e) => update("certifications", i, "issuer", e.target.value)} placeholder="Amazon" /></div>
            <div><label className="label">Date</label><input type="month" className="input" value={item.date || ""} onChange={(e) => update("certifications", i, "date", e.target.value)} /></div>
            <div><label className="label">Link</label><input className="input" value={item.link || ""} onChange={(e) => update("certifications", i, "link", e.target.value)} placeholder="cert-url.com" /></div>
          </div>
        </div>
      ))}
      <button onClick={add} className="btn-secondary w-full"><Plus className="w-4 h-4" /> {t("builder.add")} {t("builder.certifications")}</button>
    </div>
  );
}

function LanguagesForm({ languages, update }) {
  const [input, setInput] = useState("");
  const { t } = useTranslation();
  const add = () => { if (input.trim()) { update([...languages, input.trim()]); setInput(""); } };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Add a language..." />
        <button onClick={add} className="btn-primary shrink-0"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
            {lang}
            <button onClick={() => update(languages.filter((_, idx) => idx !== i))} className="hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
    </div>
  );
}

function InterestsForm({ interests, update }) {
  const [input, setInput] = useState("");
  const { t } = useTranslation();
  const add = () => { if (input.trim()) { update([...interests, input.trim()]); setInput(""); } };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Add an interest..." />
        <button onClick={add} className="btn-primary shrink-0"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm">
            {interest}
            <button onClick={() => update(interests.filter((_, idx) => idx !== i))} className="hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
    </div>
  );
}

function PersonalDetailsForm({ data, update }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Father's Name</label>
          <input className="input" value={data.fatherName || ""} onChange={handleTitleCase(update, "fatherName")} placeholder="Father's full name" />
        </div>
        <div>
          <label className="label">Mother's Name</label>
          <input className="input" value={data.motherName || ""} onChange={handleTitleCase(update, "motherName")} placeholder="Mother's full name" />
        </div>
        <div>
          <label className="label">Date of Birth</label>
          <input type="date" className="input" value={data.dateOfBirth || ""} onChange={(e) => update("dateOfBirth", e.target.value)} />
        </div>
        <div>
          <label className="label">Gender</label>
          <select className="input" value={data.gender || ""} onChange={(e) => update("gender", e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Hobbies</label>
        <textarea className="input min-h-[80px] resize-y" value={data.hobbies || ""} onChange={handleTitleCase(update, "hobbies")} placeholder="e.g. Reading, Traveling, Photography, Playing Chess..." />
      </div>
    </div>
  );
}

function TemplateForm({ resume, update }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Accent Color</label>
        <div className="flex items-center gap-3">
          <input type="color" value={resume.accentColor || "#2563eb"} onChange={(e) => update("accentColor", e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
          <input type="text" value={resume.accentColor || "#2563eb"} onChange={(e) => update("accentColor", e.target.value)} className="input flex-1" />
        </div>
      </div>
      <div>
        <label className="label">{t("builder.selectTemplate")}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => update("template", tpl.id)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                resume.template === tpl.id ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="w-full h-16 rounded mb-2 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${tpl.color}, ${tpl.color}dd)` }}>
                <span className="text-white text-xs font-bold">{tpl.name.charAt(0)}</span>
              </div>
              <span className="text-xs font-medium">{tpl.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


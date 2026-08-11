import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ResumePreview from "../components/resume/ResumePreview.jsx";
import { templates, defaultResumeData } from "../utils/defaultResume.js";

const sampleData = {
  ...defaultResumeData,
  title: "Sample Resume",
  template: "modern",
  personalInfo: {
    fullName: "Jane Doe",
    jobTitle: "Full Stack Developer",
    email: "jane.doe@email.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/janedoe",
    github: "github.com/janedoe",
    summary: "Experienced Full Stack Developer with 3+ years building scalable web applications using React, Node.js, and MongoDB. Passionate about clean code and user experience.",
  },
  education: [
    { institution: "Stanford University", degree: "B.Tech", field: "Computer Science", startDate: "2019-08", endDate: "2023-05", grade: "9.2 CGPA" },
  ],
  skills: ["React", "Node.js", "Express", "MongoDB", "TypeScript", "AWS", "Docker", "Git"],
  experience: [
    { company: "Tech Corp", position: "Software Engineer", location: "Remote", startDate: "2023-06", endDate: "", current: true, description: "Developed and maintained full-stack web applications serving 100K+ users. Optimized database queries reducing load time by 40%." },
  ],
  projects: [
    { name: "E-Commerce Platform", techStack: "React, Node.js, MongoDB", description: "Built a full-featured e-commerce platform with payment integration and admin dashboard." },
  ],
  certifications: [{ name: "AWS Solutions Architect", issuer: "Amazon", date: "2024-01" }],
  languages: ["English", "Hindi", "Spanish"],
  interests: ["Open Source", "Chess", "Hiking"],
};

export default function Templates() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);

  const handleUseTemplate = async (templateId) => {
    try {
      const { data } = await api.post("/resumes", {
        ...sampleData,
        template: templateId,
        title: "Untitled Resume",
        personalInfo: { ...sampleData.personalInfo, fullName: user?.name || "" },
      });
      toast.success("Resume created with template!");
      navigate(`/builder/${data.resume._id}`);
    } catch (error) {
      toast.error("Failed to create resume");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("nav.templates")}</h1>
        <p className="text-gray-500 dark:text-gray-400">Choose from 25+ professional templates with live preview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl, i) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card overflow-hidden p-0 group"
          >
            {/* Preview */}
            <div className="relative h-72 overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer" onClick={() => setSelected(tpl.id)}>
              <div className="origin-top-left" style={{ transform: "scale(0.32)", width: "312.5%", pointerEvents: "none" }}>
                <ResumePreview data={{ ...sampleData, template: tpl.id, accentColor: tpl.color }} />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Preview
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="badge bg-white/90 text-gray-700 text-xs">{tpl.category}</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{tpl.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-3 h-3 rounded-full" style={{ background: tpl.color }} />
                  <span className="text-xs text-gray-500">{tpl.category}</span>
                </div>
              </div>
              <button onClick={() => handleUseTemplate(tpl.id)} className="btn-primary text-sm">
                Use
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full preview modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
              <h3 className="font-semibold">{templates.find((t) => t.id === selected)?.name}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => handleUseTemplate(selected)} className="btn-primary text-sm">Use Template</button>
                <button onClick={() => setSelected(null)} className="btn-ghost text-sm">Close</button>
              </div>
            </div>
            <div className="overflow-x-auto p-4">
              <ResumePreview data={{ ...sampleData, template: selected, accentColor: templates.find((t) => t.id === selected)?.color }} scale={0.8} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

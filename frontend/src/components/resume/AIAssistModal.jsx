import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, Check, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import aiApi from "../../services/aiService.js";

export default function AIAssistModal({ isOpen, onClose, onApply, type, currentText, context }) {
  const [input, setInput] = useState(currentText || "");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const typeLabels = {
    experience: "Improve Experience",
    project: "Improve Project Description",
    summary: "Generate Summary",
    skill: "Suggest Skills",
    certification: "Improve Certification",
    education: "Improve Education",
  };

  const typePlaceholders = {
    summary: "e.g., Software Engineer (uses the Job Title from Personal Info)",
    skill: "e.g., Frontend Developer (role to suggest skills for)",
    experience: "e.g., I created a college management system",
    project: "e.g., Built a full-stack e-commerce app with React and Node.js",
    education: "e.g., B.Tech in Computer Science",
    certification: "e.g., AWS Certified Solutions Architect",
  };

  const typeHints = {
    summary: "Tip: Enter your Job Title in the Personal Info section — the summary is generated based on it.",
    skill: "Tip: Enter a target role (e.g., Frontend Developer) to get skill suggestions.",
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    try {
      let data;
      if (type === "summary") {
        // Summary generation requires a job title (passed as context from the builder)
        if (!context) {
          toast.error("Please enter a Job Title in the Personal Info section first");
          return;
        }
        data = await aiApi.generateSummary({ jobTitle: context, skills: [], experience: [], projects: [] });
        setResult(data.summary);
      } else if (type === "skill") {
        // Skill suggestions use a dedicated endpoint that returns categorized skills
        const role = input.trim() || context || "Software Engineer";
        data = await aiApi.suggestSkills(role, []);
        const allSkills = [
          ...(data.skills?.technical || []),
          ...(data.skills?.soft || []),
          ...(data.skills?.tools || []),
          ...(data.skills?.frameworks || []),
        ];
        setResult(allSkills.join(", "));
      } else {
        if (!input.trim()) {
          toast.error("Please enter some text first");
          return;
        }
        data = await aiApi.improveText(input, type, context);
        setResult(data.improved);
      }
    } catch (error) {
      toast.error(error.message || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onApply(result);
    onClose();
    setResult("");
    setInput("");
  };

  const handleClose = () => {
    onClose();
    setResult("");
    setInput(currentText || "");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold">{typeLabels[type] || "AI Assist"}</h3>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {typeHints[type] && (
                <p className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                  {typeHints[type]}
                </p>
              )}
              <div>
                <label className="label">{type === "summary" ? "Job Title" : type === "skill" ? "Target Role" : "Your Text"}</label>
                <textarea
                  className="input min-h-[100px] resize-y"
                  placeholder={typePlaceholders[type] || "e.g., I created a college management system"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate with AI</>
                )}
              </button>

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="label">AI Result</label>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleApply} className="btn-primary flex-1">
                      <Check className="w-4 h-4" /> Apply
                    </button>
                    <button onClick={handleGenerate} className="btn-secondary">
                      <RefreshCw className="w-4 h-4" /> Regenerate
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Target,
  Sparkles,
  Download,
  Palette,
  Plus,
  TrendingUp,
  Eye,
  Clock,
  MoreVertical,
  Copy,
  Trash2,
  History,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/ui/Loader.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, resumesRes] = await Promise.all([
        api.get("/resumes/analytics/summary"),
        api.get("/resumes"),
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setResumes(resumesRes.data.resumes);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const { data } = await api.post("/resumes", {
        title: "Untitled Resume",
        template: "modern",
        personalInfo: { fullName: user?.name || "" },
      });
      toast.success("New resume created!");
      navigate(`/builder/${data.resume._id}`);
    } catch (error) {
      toast.error("Failed to create resume");
    }
  };

  const handleDuplicate = async (id, e) => {
    e.stopPropagation();
    try {
      await api.post(`/resumes/${id}/duplicate`);
      toast.success("Resume duplicated");
      fetchData();
    } catch (error) {
      toast.error("Failed to duplicate");
    }
    setMenuOpen(null);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this resume? This cannot be undone.")) return;
    try {
      await api.delete(`/resumes/${id}`);
      toast.success("Resume deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
    setMenuOpen(null);
  };

  if (loading) return <Loader fullScreen />;

  const cards = [
    { icon: FileText, label: t("dashboard.myResumes"), value: analytics?.totalResumes || 0, color: "bg-blue-500", to: "/builder" },
    { icon: Target, label: t("dashboard.atsScore"), value: `${analytics?.avgAts || 0}/100`, color: "bg-green-500", to: "/ai-tools" },
    { icon: Sparkles, label: t("dashboard.aiSuggestions"), value: "AI", color: "bg-purple-500", to: "/ai-tools" },
    { icon: Download, label: t("dashboard.totalDownloads"), value: analytics?.totalDownloads || 0, color: "bg-orange-500", to: "/templates" },
    { icon: Palette, label: t("dashboard.templates"), value: "25+", color: "bg-pink-500", to: "/templates" },
    { icon: Eye, label: t("dashboard.totalViews"), value: analytics?.totalViews || 0, color: "bg-indigo-500", to: "/dashboard" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("dashboard.welcome")}, {user?.name} 👋
          </p>
        </div>
        <button onClick={handleCreate} className="btn-primary">
          <Plus className="w-5 h-5" />
          {t("dashboard.newResume")}
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={card.to} className="card hover:shadow-md transition-shadow group cursor-pointer block">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t("dashboard.quickActions")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Sparkles, label: t("ai.writingAssistant"), to: "/ai-tools", color: "text-purple-500" },
            { icon: Target, label: t("ai.atsChecker"), to: "/ai-tools", color: "text-green-500" },
            { icon: FileText, label: t("ai.coverLetter"), to: "/ai-tools", color: "text-blue-500" },
            { icon: TrendingUp, label: t("ai.jdMatch"), to: "/ai-tools", color: "text-orange-500" },
          ].map((action) => (
            <Link key={action.label} to={action.to} className="card hover:shadow-md transition-shadow flex items-center gap-3 group">
              <action.icon className={`w-6 h-6 ${action.color}`} />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Resumes */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t("dashboard.recentResumes")}</h2>
        {resumes.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t("dashboard.noResumes")}</p>
            <button onClick={handleCreate} className="btn-primary">
              <Plus className="w-5 h-5" />
              {t("dashboard.newResume")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card hover:shadow-md transition-shadow cursor-pointer relative group"
                onClick={() => navigate(`/builder/${resume._id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === resume._id ? null : resume._id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    {menuOpen === resume._id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                        <button onClick={(e) => handleDuplicate(resume._id, e)} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Copy className="w-4 h-4" /> Duplicate
                        </button>
                        <Link to={`/history/${resume._id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                          <History className="w-4 h-4" /> History
                        </Link>
                        <button onClick={(e) => handleDelete(resume._id, e)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold truncate">{resume.title}</h3>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" /> {resume.atsScore || 0}/100
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" /> {resume.downloads || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {resume.views || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

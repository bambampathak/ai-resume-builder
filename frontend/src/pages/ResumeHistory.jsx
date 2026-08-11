import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    History,
    RotateCcw,
    Clock,
    FileText,
    AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import api from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";

export default function ResumeHistory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [versions, setVersions] = useState([]);
    const [resumeTitle, setResumeTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [restoring, setRestoring] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, [id]);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get(`/resumes/${id}/history`);
            setVersions(data.versions);
            // Also fetch resume title
            try {
                const resumeRes = await api.get(`/resumes/${id}`);
                setResumeTitle(resumeRes.data.resume?.title || "Resume");
            } catch {
                setResumeTitle("Resume");
            }
        } catch (error) {
            toast.error("Failed to load version history");
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (versionIndex) => {
        if (
            !confirm(
                "Restore this version? Your current resume will be saved as a new version before restoring."
            )
        )
            return;
        setRestoring(versionIndex);
        try {
            await api.post(`/resumes/${id}/restore/${versionIndex}`);
            toast.success("Version restored successfully!");
            navigate(`/builder/${id}`);
        } catch (error) {
            toast.error("Failed to restore version");
        } finally {
            setRestoring(null);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    to="/dashboard"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <History className="w-6 h-6 text-primary-500" />
                        {t("builder.history") || "Version History"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {resumeTitle} • {versions.length}{" "}
                        {versions.length === 1 ? "version" : "versions"}
                    </p>
                </div>
                <Link to={`/builder/${id}`} className="btn-secondary">
                    <FileText className="w-4 h-4" />
                    Back to Editor
                </Link>
            </div>

            {/* Timeline */}
            {versions.length === 0 ? (
                <div className="card text-center py-16">
                    <AlertCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No saved versions yet. Versions are created when you save with the
                        "Save Version" button in the resume builder.
                    </p>
                    <Link to={`/builder/${id}`} className="btn-primary">
                        Go to Resume Builder
                    </Link>
                </div>
            ) : (
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

                    <div className="space-y-4">
                        {versions
                            .slice()
                            .reverse()
                            .map((version, displayIndex) => {
                                const actualIndex = versions.length - 1 - displayIndex;
                                const isLatest = displayIndex === 0;
                                return (
                                    <motion.div
                                        key={actualIndex}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: displayIndex * 0.05 }}
                                        className="relative flex gap-4"
                                    >
                                        {/* Timeline dot */}
                                        <div
                                            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isLatest
                                                    ? "bg-green-500"
                                                    : "bg-gray-300 dark:bg-gray-700"
                                                }`}
                                        >
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>

                                        {/* Content card */}
                                        <div className="card flex-1 flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold">{version.label}</h3>
                                                    {isLatest && (
                                                        <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(version.savedAt)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRestore(actualIndex)}
                                                disabled={restoring !== null}
                                                className="btn-secondary !py-2 !px-3 text-sm disabled:opacity-50"
                                            >
                                                {restoring === actualIndex ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        Restoring...
                                                    </>
                                                ) : (
                                                    <>
                                                        <RotateCcw className="w-4 h-4" />
                                                        Restore
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Info note */}
            {versions.length > 0 && (
                <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                            <p className="font-semibold mb-1">How versioning works</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                                <li>Versions are saved when you click "Save Version" in the builder</li>
                                <li>Only the last 20 versions are kept</li>
                                <li>Restoring a version saves your current state first</li>
                                <li>You can always undo a restore by restoring the previous version</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

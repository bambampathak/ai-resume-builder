import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            await forgotPassword(email);
            setSent(true);
            toast.success("Reset link sent if email exists");
        } catch (error) {
            toast.error(error.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <AuthLayout title={t("auth.forgotTitle")} subtitle={t("auth.forgotSubtitle")}>
                <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
                    </p>
                    <Link to="/login" className="btn-primary w-full">
                        {t("auth.backToLogin")}
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title={t("auth.forgotTitle")}
            subtitle={t("auth.forgotSubtitle")}
            footer={
                <Link to="/login" className="inline-flex items-center gap-1 text-primary-600 hover:underline">
                    <ArrowLeft className="w-4 h-4" />
                    {t("auth.backToLogin")}
                </Link>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">{t("auth.email")}</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            className="input pl-10"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? t("common.loading") : t("auth.sendResetLink")}
                </button>
            </form>
        </AuthLayout>
    );
}

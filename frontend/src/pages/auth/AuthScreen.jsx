import { forwardRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext.jsx";
import "./auth.css";

function FieldError({ children }) {
  return children ? <p className="auth-error">{children}</p> : null;
}

function GoogleButton({ mode, onSuccess, onError }) {
  return (
    <div className="auth-google">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        theme="outline"
        size="large"
        width="100%"
        text={mode === "login" ? "signin_with" : "signup_with"}
        shape="rectangular"
      />
    </div>
  );
}

export default function AuthScreen({ initialMode = "login" }) {
  const { login, signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [mode, setMode] = useState(initialMode);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const loginForm = useForm();
  const signupForm = useForm();
  const signupPassword = signupForm.watch("password");

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, location.pathname]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    navigate(nextMode === "login" ? "/login" : "/signup", { replace: true });
  };

  const onLogin = async (data) => {
    setLoginLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const onSignup = async (data) => {
    setSignupLoading(true);
    try {
      await signup(data.name, data.email, data.password);
      toast.success("Account created! Welcome aboard.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Signup failed");
    } finally {
      setSignupLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse, googleMode) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      await googleLogin({
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        avatar: decoded.picture,
      });
      toast.success(googleMode === "login" ? "Welcome back!" : "Account created! Welcome aboard.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || `Google ${googleMode} failed`);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was unsuccessful. Please try again.");
  };

  return (
    <main className="auth-page">
      <section className={`auth-shell ${mode === "signup" ? "is-signup" : ""}`}>
        <div className="auth-form-panel auth-login-panel">
          <div className="auth-form-content">
            <AuthLogo />
            <div className="auth-heading">
              <span className="auth-kicker"><Sparkles size={14} /> AI-Powered</span>
              <h1>{t("auth.loginTitle")}</h1>
              <p>{t("auth.loginSubtitle")}</p>
            </div>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="auth-form">
              <AuthInput icon={<Mail />} label={t("auth.email")} type="email" placeholder="you@example.com" error={loginForm.formState.errors.email?.message} {...loginForm.register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} />
              <AuthInput icon={<Lock />} label={t("auth.password")} type={showLoginPassword ? "text" : "password"} placeholder="••••••••" error={loginForm.formState.errors.password?.message} action={<PasswordButton shown={showLoginPassword} onClick={() => setShowLoginPassword((value) => !value)} />} {...loginForm.register("password", { required: "Password is required" })} />
              <div className="auth-forgot"><Link to="/forgot-password">{t("auth.forgotPassword")}</Link></div>
              <button className="auth-submit" type="submit" disabled={loginLoading}>{loginLoading ? t("common.loading") : <>{t("auth.loginBtn")} <ArrowRight size={18} /></>}</button>
            </form>
            <AuthDivider />
            <GoogleButton mode="login" onSuccess={(response) => handleGoogle(response, "login")} onError={handleGoogleError} />
            <p className="auth-mobile-switch">{t("auth.noAccount")} <button type="button" onClick={() => switchMode("signup")}>{t("nav.signup")}</button></p>
          </div>
        </div>

        <div className="auth-form-panel auth-signup-panel">
          <div className="auth-form-content">
            <AuthLogo />
            <div className="auth-heading">
              <span className="auth-kicker"><Sparkles size={14} /> AI-Powered</span>
              <h1>{t("auth.signupTitle")}</h1>
              <p>{t("auth.signupSubtitle")}</p>
            </div>
            <form onSubmit={signupForm.handleSubmit(onSignup)} className="auth-form">
              <AuthInput icon={<User />} label={t("auth.name")} type="text" placeholder="John Doe" error={signupForm.formState.errors.name?.message} {...signupForm.register("name", { required: "Name is required", minLength: { value: 2, message: "Name too short" } })} />
              <AuthInput icon={<Mail />} label={t("auth.email")} type="email" placeholder="you@example.com" error={signupForm.formState.errors.email?.message} {...signupForm.register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} />
              <AuthInput
                icon={<Lock />}
                label={t("auth.password")}
                type={showSignupPassword ? "text" : "password"}
                placeholder="••••••••"
                error={signupForm.formState.errors.password?.message}
                action={<PasswordButton shown={showSignupPassword} onClick={() => setShowSignupPassword((value) => !value)} />}
                {...signupForm.register("password", {
                  required: "Password is required",
                  validate: {
                    minLength: (v) => v.length >= 8 || "Password must be at least 8 characters long",
                    capital: (v) => /[A-Z]/.test(v) || "Must contain at least 1 uppercase letter (A-Z)",
                    number: (v) => /[0-9]/.test(v) || "Must contain at least 1 number (0-9)",
                    special: (v) => /[^A-Za-z0-9]/.test(v) || "Must contain at least 1 special character (!@#$%...)",
                  },
                })}
              />
              <AuthInput icon={<Lock />} label={t("auth.confirmPassword")} type={showSignupPassword ? "text" : "password"} placeholder="••••••••" error={signupForm.formState.errors.confirmPassword?.message} {...signupForm.register("confirmPassword", { required: "Please confirm password", validate: (value) => value === signupPassword || "Passwords don't match" })} />
              <button className="auth-submit" type="submit" disabled={signupLoading}>{signupLoading ? t("common.loading") : <>{t("auth.signupBtn")} <ArrowRight size={18} /></>}</button>
            </form>
            <AuthDivider />
            <GoogleButton mode="signup" onSuccess={(response) => handleGoogle(response, "signup")} onError={handleGoogleError} />
            <p className="auth-mobile-switch">{t("auth.haveAccount")} <button type="button" onClick={() => switchMode("login")}>{t("nav.login")}</button></p>
          </div>
        </div>

        <div className="auth-toggle-panel">
          <div className="auth-toggle-content auth-toggle-login">
            <AuthLogo light />
            <h2>Hello, friend!</h2>
            <p>Start your journey with a smarter resume today.</p>
            <button type="button" className="auth-outline-button" onClick={() => switchMode("signup")}>Sign Up</button>
          </div>
          <div className="auth-toggle-content auth-toggle-signup">
            <AuthLogo light />
            <h2>Welcome back!</h2>
            <p>Sign in to continue building your future.</p>
            <button type="button" className="auth-outline-button" onClick={() => switchMode("login")}>Sign In</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function AuthLogo({ light = false }) {
  return <Link to="/" className={`auth-logo ${light ? "auth-logo-light" : ""}`}><img src="/resumio-logo.svg" alt="Resumio" style={{ width: "1.85rem", height: "1.85rem", objectFit: "contain" }} /><strong>Resumio</strong></Link>;
}

function AuthDivider() {
  return <div className="auth-divider"><span>or</span></div>;
}

function PasswordButton({ shown, onClick }) {
  return <button type="button" className="auth-password-toggle" onClick={onClick} aria-label={shown ? "Hide password" : "Show password"}>{shown ? <EyeOff size={18} /> : <Eye size={18} />}</button>;
}

const AuthInput = forwardRef(function AuthInput(
  { icon, label, action, error, ...props },
  ref
) {
  return (
    <div className="auth-field">
      <label>{label}</label>
      <div className="auth-input-wrap">
        <span className="auth-input-icon">{icon}</span>
        <input ref={ref} {...props} />
        {action ? <span>{action}</span> : null}
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
});

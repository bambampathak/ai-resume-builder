import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Palette,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../i18n/i18n.js";
import "./navbar.css";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, key: "nav.dashboard" },
  { to: "/builder", icon: FileText, key: "nav.builder" },
  { to: "/templates", icon: Palette, key: "nav.templates" },
  { to: "/ai-tools", icon: Sparkles, key: "nav.aiTools" },
  { to: "/ai-chat", icon: MessageSquare, key: "ai.chat" },
];

export default function Navbar({ publicOnly = false }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const showPublicLinks = publicOnly || !user;
  const closeMenu = () => setMobileOpen(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMenu();
  };
  const toggleLanguage = () => changeLanguage(i18n.language === "en" ? "hi" : "en");

  return (
    <nav className="site-navbar">
      <div className="site-navbar-inner">
        <Link to={showPublicLinks ? "/" : "/dashboard"} className="site-logo" onClick={closeMenu}>
          <img className="site-logo-image" src="/resumio-logo.svg" alt="Resumio" style={{ width: "1.75rem", height: "1.75rem", objectFit: "contain" }} />
          <strong>Resumio</strong>
        </Link>

        <button className="site-menu-toggle" type="button" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        <div className={`site-nav-content ${mobileOpen ? "is-open" : ""}`}>
          <ul className="site-nav-links">
            {showPublicLinks ? (
              <>
                <li><a href="#home" onClick={closeMenu}>{t("nav.home")}</a></li>
                <li><a href="#features" onClick={closeMenu}>{t("nav.about")}</a></li>
              </>
            ) : navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.to);
              return <li key={item.to}><Link to={item.to} className={isActive ? "is-active" : ""} onClick={closeMenu}><item.icon size={16} />{t(item.key)}</Link></li>;
            })}
          </ul>

          <div className="site-nav-actions">
            <button type="button" onClick={toggleLanguage} title={t("nav.switchLanguage")}><Globe size={18} /></button>
            <button type="button" onClick={toggleTheme} title={t("nav.toggleTheme")}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
            {user ? (
              <div className="site-auth-links">
                {publicOnly ? <Link to="/dashboard" className="site-auth-primary" onClick={closeMenu}>{t("nav.dashboard")}</Link> : null}
                <button type="button" onClick={handleLogout} title={t("nav.logout")}><LogOut size={18} /></button>
              </div>
            ) : (
              <div className="site-auth-links"><Link to="/login" onClick={closeMenu}>{t("auth.loginBtn")}</Link><Link to="/signup" className="site-auth-primary" onClick={closeMenu}>{t("landing.getStarted")}</Link></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

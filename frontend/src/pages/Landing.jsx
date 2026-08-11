import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Download,
  Brain,
  Target,
  Languages,
  ArrowRight,
  FileText,
  Users,
  Zap,
  Star,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import "./landing.css";

/* ── Floating Orbs Background ────────────────────────────────── */
const orbs = [
  { size: 320, x: "10%", y: "15%", color: "rgba(59,130,246,0.12)", delay: 0, duration: 22 },
  { size: 240, x: "75%", y: "10%", color: "rgba(139,92,246,0.10)", delay: 2, duration: 18 },
  { size: 180, x: "60%", y: "65%", color: "rgba(14,165,233,0.08)", delay: 4, duration: 25 },
  { size: 260, x: "25%", y: "70%", color: "rgba(168,85,247,0.09)", delay: 1, duration: 20 },
  { size: 140, x: "85%", y: "50%", color: "rgba(59,130,246,0.07)", delay: 3, duration: 16 },
];

function FloatingOrbs() {
  return (
    <div className="landing-orbs" aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="landing-orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.08, 0.95, 1.04, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ── Animated Grid Background ────────────────────────────────── */
function AnimatedGrid() {
  return (
    <div className="landing-grid" aria-hidden="true">
      <div className="landing-grid-lines" />
    </div>
  );
}

/* ── Typewriter Hook ─────────────────────────────────────────── */
function useTypewriter(text, speed = 60, startDelay = 800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

/* ── Animated Counter ────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "", duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="landing-counter-value">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ── 3D Tilt Card ────────────────────────────────────────────── */
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMouse = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const resetMouse = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={`landing-tilt-card ${className}`}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
    >
      {children}
    </motion.div>
  );
}

/* ── Particle field ──────────────────────────────────────────── */
function ParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 8,
    delay: Math.random() * 5,
  }));

  return (
    <div className="landing-particles" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="landing-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Feature keys ────────────────────────────────────────────── */
const featureKeys = [
  [Brain, "landing.featureWritingTitle", "landing.featureWritingDesc"],
  [Target, "landing.featureAtsTitle", "landing.featureAtsDesc"],
  [Sparkles, "landing.featureTemplatesTitle", "landing.featureTemplatesDesc"],
  [Download, "landing.featurePdfTitle", "landing.featurePdfDesc"],
  [Languages, "landing.featureLanguageTitle", "landing.featureLanguageDesc"],
];

const stats = [
  { icon: Users, value: 12000, suffix: "+", label: "Users" },
  { icon: FileText, value: 45000, suffix: "+", label: "Resumes Created" },
  { icon: Star, value: 98, suffix: "%", label: "Satisfaction" },
  { icon: Zap, value: 30, suffix: "s", label: "Avg. Build Time" },
];

/* ── Scroll indicator ────────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      className="landing-scroll-indicator"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      <ChevronDown className="w-5 h-5 text-gray-300 dark:text-gray-600 -mt-3" />
    </motion.div>
  );
}

/* ── Floating resume mockup ──────────────────────────────────── */
function FloatingResume() {
  return (
    <motion.div
      className="landing-resume-float"
      animate={{ y: [0, -12, 0], rotate: [0, 1, -1, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="landing-resume-mock">
        <div className="mock-header" />
        <div className="mock-line w-3/4" />
        <div className="mock-line w-1/2" />
        <div className="mock-spacer" />
        <div className="mock-line w-full" />
        <div className="mock-line w-5/6" />
        <div className="mock-line w-2/3" />
        <div className="mock-spacer" />
        <div className="mock-line w-full" />
        <div className="mock-line w-4/5" />
        <div className="mock-line w-1/2" />
        <div className="mock-spacer" />
        <div className="mock-line w-3/4" />
        <div className="mock-line w-2/3" />
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ██  LANDING PAGE                                          ██ */
/* ══════════════════════════════════════════════════════════════ */
export default function Landing() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const features = featureKeys.map(([icon, titleKey, descKey]) => ({
    icon,
    title: t(titleKey),
    desc: t(descKey),
  }));
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  const heroTitle = t("landing.title");
  const { displayed: typedTitle, done: typingDone } = useTypewriter(heroTitle, 50, 600);

  /* stagger variants */
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="landing-root">
      <Navbar publicOnly />

      {/* ── Background layers ── */}
      <FloatingOrbs />
      <AnimatedGrid />
      <ParticleField />

      {/* ══════════  HERO  ══════════ */}
      <section id="home" className="landing-hero">
        <motion.div
          className="landing-hero-content"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="landing-badge">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
            {t("landing.badge")}
          </motion.div>

          {/* Headline with typewriter */}
          <motion.h1 variants={fadeUp} className="landing-headline">
            <span className="landing-typed">
              {typedTitle}
              {!typingDone && <span className="landing-cursor">|</span>}
            </span>
            <AnimatePresence>
              {typingDone && (
                <motion.span
                  className="landing-headline-gradient"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {t("landing.titleHighlight")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.h1>

          {/* Description */}
          <motion.p variants={fadeUp} className="landing-description">
            {t("landing.description")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="landing-cta-group">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="landing-btn-primary"
            >
              <span className="landing-btn-glow" />
              {user ? t("landing.goToDashboard") : t("landing.startBuilding")}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/templates" className="landing-btn-secondary">
              {t("landing.viewTemplates")}
            </Link>
          </motion.div>

          <ScrollIndicator />
        </motion.div>

        {/* Floating resume mockup on larger screens */}
        <motion.div
          className="landing-hero-visual"
          initial={{ opacity: 0, x: 60, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
        >
          <FloatingResume />
        </motion.div>
      </section>

      {/* ══════════  STATS  ══════════ */}
      <section className="landing-stats" ref={statsRef}>
        <motion.div
          className="landing-stats-grid"
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={container}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="landing-stat-item">
              <div className="landing-stat-icon">
                <stat.icon className="w-5 h-5" />
              </div>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <span className="landing-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════  FEATURES  ══════════ */}
      <section id="features" className="landing-features" ref={featuresRef}>
        <motion.div
          className="landing-features-header"
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="landing-section-title">
            Everything you need to land your
            <span className="landing-headline-gradient"> dream job</span>
          </h2>
          <p className="landing-section-subtitle">
            Powerful AI tools combined with beautiful templates to create resumes that get noticed.
          </p>
        </motion.div>

        <motion.div
          className="landing-features-grid"
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={container}
        >
          {features.map((feature, i) => (
            <motion.div key={feature.title} variants={fadeUp}>
              <TiltCard className="landing-feature-card">
                <div className="landing-feature-icon-wrap">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-6 h-6" />
                  </motion.div>
                </div>
                <h3 className="landing-feature-title">{feature.title}</h3>
                <p className="landing-feature-desc">{feature.desc}</p>
                <div className="landing-feature-shine" />
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════  CTA  ══════════ */}
      <section id="contact" className="landing-cta-section">
        <motion.div
          className="landing-cta-card"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="landing-cta-bg-orb landing-cta-bg-orb-1"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="landing-cta-bg-orb landing-cta-bg-orb-2"
            animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
          <h2 className="landing-cta-title">{t("landing.ctaTitle")}</h2>
          <p className="landing-cta-desc">{t("landing.ctaDescription")}</p>
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="landing-cta-button"
          >
            {t("landing.ctaButton")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer spacer */}
      <div className="h-12" />
    </div>
  );
}

export const defaultResumeData = {
  title: "Untitled Resume",
  template: "modern",
  accentColor: "#2563eb",
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    photo: "",
  },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: [],
  personalDetails: {
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "",
    hobbies: "",
  },
};

export const emptyEducation = () => ({
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  grade: "",
  description: "",
});

export const emptyExperience = () => ({
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
});

export const emptyProject = () => ({
  name: "",
  techStack: "",
  link: "",
  description: "",
});

export const emptyCertification = () => ({
  name: "",
  issuer: "",
  date: "",
  link: "",
});

export const templates = [
  { id: "modern", name: "Modern", category: "Modern", color: "#2563eb" },
  { id: "professional", name: "Professional", category: "Professional", color: "#1e40af" },
  { id: "creative", name: "Creative", category: "Creative", color: "#7c3aed" },
  { id: "minimal", name: "Minimal", category: "Minimal", color: "#374151" },
  { id: "harvard", name: "Harvard", category: "Professional", color: "#991b1b" },
  { id: "ats", name: "ATS Friendly", category: "ATS", color: "#000000" },
  { id: "elegant", name: "Elegant", category: "Modern", color: "#0f766e" },
  { id: "compact", name: "Compact", category: "Minimal", color: "#475569" },
  { id: "bold", name: "Bold", category: "Creative", color: "#dc2626" },
  { id: "classic", name: "Classic", category: "Professional", color: "#1f2937" },
  { id: "tech", name: "Tech", category: "Modern", color: "#059669" },
  { id: "executive", name: "Executive", category: "Professional", color: "#7c2d12" },
  { id: "sidebar", name: "Sidebar", category: "Creative", color: "#6366f1" },
  { id: "gradient", name: "Gradient", category: "Creative", color: "#8b5cf6" },
  { id: "clean", name: "Clean", category: "Minimal", color: "#0891b2" },
  { id: "timeline", name: "Timeline", category: "Creative", color: "#e11d48" },
  { id: "twocolumn", name: "Two Column", category: "Modern", color: "#0d9488" },
  { id: "metro", name: "Metro", category: "Modern", color: "#f59e0b" },
  { id: "academic", name: "Academic", category: "Professional", color: "#4338ca" },
  { id: "infographic", name: "Infographic", category: "Creative", color: "#ec4899" },
  { id: "nordic", name: "Nordic", category: "Minimal", color: "#64748b" },
  { id: "corporate", name: "Corporate", category: "Professional", color: "#0369a1" },
  { id: "magazine", name: "Magazine", category: "Creative", color: "#d946ef" },
  { id: "devsimple", name: "Dev Simple", category: "ATS", color: "#171717" },
  { id: "diamond", name: "Diamond", category: "Modern", color: "#b45309" },
];

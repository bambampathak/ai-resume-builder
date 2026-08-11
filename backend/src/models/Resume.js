import mongoose from "mongoose";

// Sub-schemas for resume sections
const personalInfoSchema = new mongoose.Schema(
    {
        fullName: { type: String, default: "" },
        jobTitle: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        website: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        summary: { type: String, default: "" },
        photo: { type: String, default: "" },
    },
    { _id: false }
);

const educationSchema = new mongoose.Schema(
    {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        field: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        grade: { type: String, default: "" },
        description: { type: String, default: "" },
    },
    { _id: false }
);

const experienceSchema = new mongoose.Schema(
    {
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        location: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        current: { type: Boolean, default: false },
        description: { type: String, default: "" },
    },
    { _id: false }
);

const projectSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        techStack: { type: String, default: "" },
        link: { type: String, default: "" },
        description: { type: String, default: "" },
    },
    { _id: false }
);

const certificationSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        issuer: { type: String, default: "" },
        date: { type: String, default: "" },
        link: { type: String, default: "" },
    },
    { _id: false }
);

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Resume title is required"],
            default: "Untitled Resume",
            trim: true,
        },
        template: {
            type: String,
            enum: [
                "modern",
                "professional",
                "creative",
                "minimal",
                "harvard",
                "ats",
                "elegant",
                "compact",
                "bold",
                "classic",
                "tech",
                "executive",
                "sidebar",
                "gradient",
                "clean",
                "timeline",
                "twocolumn",
                "metro",
                "academic",
                "infographic",
                "nordic",
                "corporate",
                "magazine",
                "devsimple",
                "diamond",
            ],
            default: "modern",
        },
        accentColor: {
            type: String,
            default: "#2563eb",
        },
        personalInfo: { type: personalInfoSchema, default: () => ({}) },
        education: { type: [educationSchema], default: [] },
        skills: { type: [String], default: [] },
        experience: { type: [experienceSchema], default: [] },
        projects: { type: [projectSchema], default: [] },
        certifications: { type: [certificationSchema], default: [] },
        languages: { type: [String], default: [] },
        interests: { type: [String], default: [] },
        // ATS + analytics
        atsScore: { type: Number, default: 0 },
        atsReport: { type: mongoose.Schema.Types.Mixed, default: null },
        downloads: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        // Version history
        versions: [
            {
                savedAt: { type: Date, default: Date.now },
                snapshot: { type: mongoose.Schema.Types.Mixed },
                label: { type: String, default: "" },
            },
        ],
        isPublic: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index for faster queries
resumeSchema.index({ user: 1, updatedAt: -1 });

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;

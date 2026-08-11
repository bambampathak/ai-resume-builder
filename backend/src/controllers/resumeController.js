import Resume from "../models/Resume.js";

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select("-versions.snapshot");
    res.json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      res.status(404);
      return next(new Error("Resume not found"));
    }
    // Increment views
    resume.views += 1;
    await resume.save();
    res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res, next) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res, next) => {
  try {
    let resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      res.status(404);
      return next(new Error("Resume not found"));
    }

    // Save a version snapshot if requested
    if (req.body.saveVersion) {
      resume.versions.push({
        savedAt: new Date(),
        snapshot: resume.toObject(),
        label: req.body.versionLabel || `Version ${resume.versions.length + 1}`,
      });
      // Keep only last 20 versions
      if (resume.versions.length > 20) {
        resume.versions = resume.versions.slice(-20);
      }
    }

    // Remove version control fields from body before assigning
    const { saveVersion, versionLabel, ...updateData } = req.body;

    Object.assign(resume, updateData);
    await resume.save();

    res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      res.status(404);
      return next(new Error("Resume not found"));
    }
    res.json({ success: true, message: "Resume deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate a resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
export const duplicateResume = async (req, res, next) => {
  try {
    const original = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!original) {
      res.status(404);
      return next(new Error("Resume not found"));
    }

    const copy = original.toObject();
    copy._id = undefined;
    copy.title = `${original.title} (Copy)`;
    copy.versions = [];
    copy.downloads = 0;
    copy.views = 0;
    copy.createdAt = undefined;
    copy.updatedAt = undefined;

    const newResume = await Resume.create(copy);
    res.status(201).json({ success: true, resume: newResume });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resume version history
// @route   GET /api/resumes/:id/history
// @access  Private
export const getHistory = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id }).select("versions title");
    if (!resume) {
      res.status(404);
      return next(new Error("Resume not found"));
    }
    const versions = resume.versions.map((v) => ({
      savedAt: v.savedAt,
      label: v.label,
    }));
    res.json({ success: true, versions });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore a resume version
// @route   POST /api/resumes/:id/restore/:versionIndex
// @access  Private
export const restoreVersion = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      res.status(404);
      return next(new Error("Resume not found"));
    }
    const versionIndex = parseInt(req.params.versionIndex, 10);
    const version = resume.versions[versionIndex];
    if (!version) {
      res.status(404);
      return next(new Error("Version not found"));
    }

    // Save current as a version before restoring
    resume.versions.push({
      savedAt: new Date(),
      snapshot: resume.toObject(),
      label: `Before restore - ${new Date().toLocaleString()}`,
    });

    // Restore fields from snapshot
    const snap = version.snapshot;
    const restoreFields = [
      "personalInfo", "education", "skills", "experience",
      "projects", "certifications", "languages", "interests",
      "template", "accentColor",
    ];
    restoreFields.forEach((field) => {
      if (snap[field] !== undefined) {
        resume[field] = snap[field];
      }
    });

    await resume.save();
    res.json({ success: true, resume, message: "Version restored" });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment download count
// @route   POST /api/resumes/:id/download
// @access  Private
export const incrementDownload = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $inc: { downloads: 1 } },
      { new: true }
    ).select("downloads views");
    if (!resume) {
      res.status(404);
      return next(new Error("Resume not found"));
    }
    res.json({ success: true, downloads: resume.downloads, views: resume.views });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/resumes/analytics/summary
// @access  Private
export const getAnalytics = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).select("atsScore downloads views title updatedAt");
    const totalDownloads = resumes.reduce((sum, r) => sum + (r.downloads || 0), 0);
    const totalViews = resumes.reduce((sum, r) => sum + (r.views || 0), 0);
    const avgAtsScore = resumes.length
      ? Math.round(resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0) / resumes.length)
      : 0;

    res.json({
      success: true,
      analytics: {
        totalResumes: resumes.length,
        totalDownloads,
        totalViews,
        avgAtsScore,
        resumes: resumes.map((r) => ({
          id: r._id,
          title: r.title,
          atsScore: r.atsScore,
          downloads: r.downloads,
          views: r.views,
          updatedAt: r.updatedAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

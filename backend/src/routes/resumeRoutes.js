import express from "express";
import {
    getResumes,
    getResume,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    getHistory,
    restoreVersion,
    incrementDownload,
    getAnalytics,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/").get(getResumes).post(createResume);
router.get("/analytics/summary", getAnalytics);
router.route("/:id").get(getResume).put(updateResume).delete(deleteResume);
router.post("/:id/duplicate", duplicateResume);
router.get("/:id/history", getHistory);
router.post("/:id/restore/:versionIndex", restoreVersion);
router.post("/:id/download", incrementDownload);

export default router;

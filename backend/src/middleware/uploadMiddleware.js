import multer from "multer";
import path from "path";

// Memory storage - we only need the file buffer to extract text, no need to persist
const storage = multer.memoryStorage();

// File filter - allow only PDF and DOC/DOCX files
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
    }
};

// Limit file size to 5MB
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

export default upload;

import fs from "fs";
import path from "path";
import multer from "multer";
import { AppError } from "../utils/AppError";

const uploadDir = process.env.UPLOAD_DIR || "src/uploads/pdfs";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .replace(path.extname(file.originalname), "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    cb(null, `${Date.now()}-${safeName}.pdf`);
  },
});

const maxSizeMb = Number(process.env.MAX_PDF_SIZE_MB || 20);

export const uploadPdf = multer({
  storage,
  limits: {
    fileSize: maxSizeMb * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new AppError("Seulement les fichiers PDF sont acceptes", 400));
    }
    cb(null, true);
  },
});

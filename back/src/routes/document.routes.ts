import { Router } from "express";
import {
  adminGetDocuments,
  adminSetDocumentStatus,
  createDocument,
  deleteDocument,
  downloadDocument,
  getDocument,
  getDocuments,
  getMyDocuments,
  updateDocument,
  viewDocument,
} from "../controllers/document.controller";
import { protect, optionalAuth, restrictTo } from "../middlewares/auth.middleware";
import { uploadPdf } from "../middlewares/upload.middleware";
import { UserRole } from "../enums/UserRole";

const router = Router();

router.get("/", getDocuments);
router.get("/mine", protect, getMyDocuments);
router.get("/admin", protect, restrictTo(UserRole.ADMIN), adminGetDocuments);
router.get("/:id", optionalAuth, getDocument);
router.get("/:id/view", optionalAuth, viewDocument);
router.get("/:id/download", optionalAuth, downloadDocument);
router.post("/", protect, uploadPdf.single("pdf"), createDocument);
router.patch("/:id/status", protect, restrictTo(UserRole.ADMIN), adminSetDocumentStatus);
router.patch("/:id", protect, uploadPdf.single("pdf"), updateDocument);
router.delete("/:id", protect, deleteDocument);

export default router;

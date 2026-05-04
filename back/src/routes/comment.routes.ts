import { Router } from "express";
import {
  createComment,
  deleteComment,
  getDocumentComments,
  updateComment,
} from "../controllers/comment.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/documents/:documentId/comments", getDocumentComments);
router.post("/documents/:documentId/comments", protect, createComment);
router.patch("/comments/:id", protect, updateComment);
router.delete("/comments/:id", protect, deleteComment);

export default router;

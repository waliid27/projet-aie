import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createCommentService,
  deleteCommentService,
  getDocumentCommentsService,
  updateCommentService,
} from "../services/comment.service";

export const getDocumentComments = asyncHandler(async (req: Request, res: Response) => {
  const comments = await getDocumentCommentsService(Number(req.params.documentId));
  res.json({ success: true, count: comments.length, comments });
});

export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const comment = await createCommentService(Number(req.params.documentId), req.body, req.user!);
  res.status(201).json({ success: true, message: "Commentaire ajoute", comment });
});

export const updateComment = asyncHandler(async (req: Request, res: Response) => {
  const comment = await updateCommentService(Number(req.params.id), req.body, req.user!);
  res.json({ success: true, message: "Commentaire modifie", comment });
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  await deleteCommentService(Number(req.params.id), req.user!);
  res.json({ success: true, message: "Commentaire supprime" });
});

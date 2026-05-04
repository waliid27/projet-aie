import { AppDataSource } from "../config/data-source";
import { Comment } from "../entities/Comment";
import { Document } from "../entities/Document";
import { User } from "../entities/User";
import { DocumentStatus } from "../enums/DocumentStatus";
import { AppError } from "../utils/AppError";
import { canManageDocument, canReadDocument } from "../utils/documentAccess";
import { CurrentUser } from "./types";

interface CommentBody {
  content?: string;
  rating?: any;
}

const commentRepository = () => AppDataSource.getRepository(Comment);
const documentRepository = () => AppDataSource.getRepository(Document);
const userRepository = () => AppDataSource.getRepository(User);

const refreshDocumentRating = async (documentId: number) => {
  const comments = await commentRepository().find({ where: { document: { id: documentId } } });
  const document = await documentRepository().findOne({ where: { id: documentId } });

  if (!document) return;

  document.ratingCount = comments.length;
  document.averageRating = comments.length
    ? Number((comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length).toFixed(2))
    : 0;

  await documentRepository().save(document);
};

export const getDocumentCommentsService = async (documentId: number) => {
  return commentRepository().find({
    where: { document: { id: documentId } },
    relations: { user: true },
    order: { createdAt: "DESC" },
  });
};

export const createCommentService = async (
  documentId: number,
  { content, rating }: CommentBody,
  currentUser: CurrentUser
) => {
  const numericRating = Number(rating);

  if (!content || !rating) {
    throw new AppError("Commentaire et note sont obligatoires", 400);
  }

  if (numericRating < 1 || numericRating > 5) {
    throw new AppError("La note doit etre entre 1 et 5", 400);
  }

  const document = await documentRepository().findOne({
    where: { id: documentId, status: DocumentStatus.ACTIVE },
    relations: { owner: true },
  });

  if (!document) throw new AppError("Document introuvable", 404);

  const allowed = await canReadDocument(document, currentUser);
  if (!allowed) {
    throw new AppError("Vous devez avoir acces au document pour commenter", 403);
  }

  const user = await userRepository().findOne({ where: { id: currentUser.id } });
  if (!user) throw new AppError("Utilisateur introuvable", 404);

  const comment = commentRepository().create({
    content,
    rating: numericRating,
    user,
    document,
  });

  await commentRepository().save(comment);
  await refreshDocumentRating(document.id);

  return comment;
};

export const updateCommentService = async (id: number, body: CommentBody, currentUser: CurrentUser) => {
  const comment = await commentRepository().findOne({
    where: { id },
    relations: { user: true, document: { owner: true } },
  });

  if (!comment) throw new AppError("Commentaire introuvable", 404);

  const isOwner = comment.user.id === currentUser.id;
  const canManageParentDocument = canManageDocument(comment.document, currentUser);

  if (!isOwner && !canManageParentDocument) {
    throw new AppError("Vous ne pouvez pas modifier ce commentaire", 403);
  }

  if (body.content !== undefined) comment.content = body.content;

  if (body.rating !== undefined) {
    const numericRating = Number(body.rating);
    if (numericRating < 1 || numericRating > 5) {
      throw new AppError("La note doit etre entre 1 et 5", 400);
    }
    comment.rating = numericRating;
  }

  await commentRepository().save(comment);
  await refreshDocumentRating(comment.document.id);

  return comment;
};

export const deleteCommentService = async (id: number, currentUser: CurrentUser) => {
  const comment = await commentRepository().findOne({
    where: { id },
    relations: { user: true, document: { owner: true } },
  });

  if (!comment) throw new AppError("Commentaire introuvable", 404);

  const isOwner = comment.user.id === currentUser.id;
  const canManageParentDocument = canManageDocument(comment.document, currentUser);

  if (!isOwner && !canManageParentDocument) {
    throw new AppError("Vous ne pouvez pas supprimer ce commentaire", 403);
  }

  const documentId = comment.document.id;
  await commentRepository().remove(comment);
  await refreshDocumentRating(documentId);
};

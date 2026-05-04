import { Document } from "../entities/Document";
import { User } from "../entities/User";

export const sanitizeUser = (user: User) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: user.fullName,
  phone: user.phone,
  dateOfBirth: user.dateOfBirth,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const serializeDocument = (document: Document, hasAccess?: boolean) => ({
  id: document.id,
  title: document.title,
  description: document.description,
  originalFileName: document.originalFileName,
  size: Number(document.size),
  price: Number(document.price),
  isFree: document.isFree,
  status: document.status,
  viewCount: document.viewCount,
  downloadCount: document.downloadCount,
  ratingCount: document.ratingCount,
  averageRating: Number(document.averageRating),
  hasAccess,
  owner: document.owner
    ? { id: document.owner.id, fullName: document.owner.fullName, email: document.owner.email }
    : undefined,
  category: document.category ? { id: document.category.id, name: document.category.name } : null,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

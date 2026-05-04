export type ApiUser = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  dateOfBirth: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiCategory = {
  id: number;
  name: string;
  description?: string | null;
};

export type ApiDocument = {
  id: number;
  title: string;
  description?: string | null;
  originalFileName: string;
  size: number;
  price: number;
  isFree: boolean;
  status: string;
  viewCount: number;
  downloadCount: number;
  ratingCount: number;
  averageRating: number;
  hasAccess?: boolean;
  owner?: {
    id: number;
    fullName: string;
    email: string;
  };
  category?: ApiCategory | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiComment = {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    fullName: string;
    email?: string;
  };
};

export type ApiPurchase = {
  id: number;
  createdAt: string;
  updatedAt: string;
  document: ApiDocument;
};

export type CatalogDocument = {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  type: "free" | "paid";
  price: number;
  rating: number;
  reviews: number;
  size: number;
  originalFileName: string;
  hasAccess: boolean;
  createdAt: string;
};

export type AppRoute =
  | { name: "home" }
  | { name: "explore" }
  | { name: "library" }
  | { name: "publish" }
  | { name: "auth" }
  | { name: "admin" }
  | { name: "document"; id: number }
  | { name: "not-found" };

export const mapDocumentToCatalog = (document: ApiDocument): CatalogDocument => ({
  id: document.id,
  title: document.title,
  description: document.description || "Aucune description disponible.",
  author: document.owner?.fullName || "Auteur inconnu",
  category: document.category?.name || "Sans categorie",
  type: document.isFree ? "free" : "paid",
  price: Number(document.price || 0),
  rating: Number(document.averageRating || 0),
  reviews: Number(document.ratingCount || 0),
  size: Number(document.size || 0),
  originalFileName: document.originalFileName,
  hasAccess: Boolean(document.isFree || document.hasAccess),
  createdAt: document.createdAt,
});

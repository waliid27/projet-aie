import type {
  ApiCategory,
  ApiComment,
  ApiDocument,
  ApiPurchase,
  ApiUser,
} from "./types";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "/api";

type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: BodyInit | null;
};

type DocumentListParams = {
  limit?: number;
  page?: number;
  search?: string;
  categoryId?: number;
};

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

const withQuery = (path: string, params: DocumentListParams = {}) => {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.page) searchParams.set("page", String(params.page));
  if (params.search) searchParams.set("search", params.search);
  if (params.categoryId) searchParams.set("categoryId", String(params.categoryId));

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
};

async function apiRequest<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const isFormData = init.body instanceof FormData;

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || `Erreur API (${response.status})`);
  }

  return payload as T;
}

export const getCurrentUser = async () => {
  const data = await apiRequest<{ user: ApiUser }>("/users/me");
  return data.user;
};

export const loginUser = async (email: string, password: string) => {
  const data = await apiRequest<{ user: ApiUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data.user;
};

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone?: string,
  dateOfBirth?: string,
) => {
  const data = await apiRequest<{ user: ApiUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, email, password, phone, dateOfBirth }),
  });
  return data.user;
};

export const logoutUser = async () => {
  await apiRequest("/auth/logout", { method: "POST" });
};

export const getCategories = async () => {
  const data = await apiRequest<{ categories: ApiCategory[] }>("/categories");
  return data.categories;
};

export const getDocuments = async (params: DocumentListParams = {}) => {
  return apiRequest<{
    documents: ApiDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(withQuery("/documents", params));
};

export const getDocument = async (documentId: number) => {
  const data = await apiRequest<{ document: ApiDocument }>(`/documents/${documentId}`);
  return data.document;
};

export const getDocumentComments = async (documentId: number) => {
  const data = await apiRequest<{ comments: ApiComment[] }>(
    `/documents/${documentId}/comments`,
  );
  return data.comments;
};

export const createDocumentComment = async (
  documentId: number,
  content: string,
  rating: number,
) => {
  const data = await apiRequest<{ comment: ApiComment }>(
    `/documents/${documentId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ content, rating }),
    },
  );
  return data.comment;
};

export const buyDocument = async (documentId: number) => {
  return apiRequest<{ message: string }>(`/purchases/documents/${documentId}/buy`, {
    method: "POST",
    body: JSON.stringify({ provider: "simple-front" }),
  });
};

export const getMyDocuments = async () => {
  const data = await apiRequest<{ documents: ApiDocument[] }>("/documents/mine");
  return data.documents;
};

export const getMyPurchases = async () => {
  const data = await apiRequest<{ purchases: ApiPurchase[] }>("/purchases/me");
  return data.purchases;
};

export const createDocument = async (payload: {
  title: string;
  description: string;
  categoryId?: number;
  isFree: boolean;
  price: number;
  pdf: File;
}) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("isFree", String(payload.isFree));
  formData.append("price", String(payload.isFree ? 0 : payload.price));

  if (payload.categoryId) {
    formData.append("categoryId", String(payload.categoryId));
  }

  formData.append("pdf", payload.pdf);

  const data = await apiRequest<{ document: ApiDocument }>("/documents", {
    method: "POST",
    body: formData,
  });

  return data.document;
};

export const getDocumentViewUrl = (documentId: number) => buildUrl(`/documents/${documentId}/view`);
export const getDocumentDownloadUrl = (documentId: number) =>
  buildUrl(`/documents/${documentId}/download`);

export const adminGetUsers = async () => {
  const data = await apiRequest<{ users: ApiUser[] }>("/users");
  return data.users;
};

export const adminSetUserActive = async (id: number, isActive: boolean) => {
  const data = await apiRequest<{ user: ApiUser }>(`/users/${id}/active`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
  return data.user;
};

export const adminGetDocuments = async () => {
  const data = await apiRequest<{ documents: ApiDocument[]; total: number }>("/documents/admin");
  return data.documents;
};

export const adminSetDocumentStatus = async (id: number, status: string) => {
  const data = await apiRequest<{ document: ApiDocument }>(`/documents/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return data.document;
};

export const adminDeleteDocument = async (id: number) => {
  await apiRequest(`/documents/${id}`, { method: "DELETE" });
};

export const adminCreateCategory = async (name: string, description?: string) => {
  const data = await apiRequest<{ category: ApiCategory }>("/categories", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
  return data.category;
};

export const adminUpdateCategory = async (id: number, name: string, description?: string) => {
  const data = await apiRequest<{ category: ApiCategory }>(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name, description }),
  });
  return data.category;
};

export const adminDeleteCategory = async (id: number) => {
  await apiRequest(`/categories/${id}`, { method: "DELETE" });
};

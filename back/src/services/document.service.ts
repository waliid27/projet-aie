import fs from "fs";
import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/Category";
import { Document } from "../entities/Document";
import { User } from "../entities/User";
import { DocumentStatus } from "../enums/DocumentStatus";
import { AppError } from "../utils/AppError";
import { canManageDocument, canReadDocument } from "../utils/documentAccess";
import { deleteLocalFile, getAbsoluteFilePath } from "../utils/file";
import { serializeDocument } from "./serializers";
import { CurrentUser, UploadedPdfFile } from "./types";

interface DocumentListQuery {
  page?: any;
  limit?: any;
  search?: any;
  categoryId?: any;
  isFree?: any;
  minPrice?: any;
  maxPrice?: any;
}

interface DocumentBody {
  title?: string;
  description?: string;
  categoryId?: any;
  price?: any;
  isFree?: any;
}

const documentRepository = () => AppDataSource.getRepository(Document);
const categoryRepository = () => AppDataSource.getRepository(Category);
const userRepository = () => AppDataSource.getRepository(User);

const parseBoolean = (value: any): boolean | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  if (value === true || value === "true" || value === "1" || value === 1) return true;
  if (value === false || value === "false" || value === "0" || value === 0) return false;
  return undefined;
};

const normalizeUploadedPath = (file: UploadedPdfFile) => file.path.replace(/\\/g, "/");

export const getDocumentsService = async (query: DocumentListQuery) => {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 10), 1), 50);
  const skip = (page - 1) * limit;

  const qb = documentRepository()
    .createQueryBuilder("document")
    .leftJoinAndSelect("document.owner", "owner")
    .leftJoinAndSelect("document.category", "category")
    .where("document.status = :status", { status: DocumentStatus.ACTIVE });

  if (query.search) {
    qb.andWhere("(document.title LIKE :search OR document.description LIKE :search)", {
      search: `%${query.search}%`,
    });
  }

  if (query.categoryId) {
    qb.andWhere("category.id = :categoryId", { categoryId: Number(query.categoryId) });
  }

  const isFree = parseBoolean(query.isFree);
  if (isFree !== undefined) {
    qb.andWhere("document.isFree = :isFree", { isFree });
  }

  if (query.minPrice) {
    qb.andWhere("document.price >= :minPrice", { minPrice: Number(query.minPrice) });
  }

  if (query.maxPrice) {
    qb.andWhere("document.price <= :maxPrice", { maxPrice: Number(query.maxPrice) });
  }

  qb.orderBy("document.createdAt", "DESC").skip(skip).take(limit);

  const [documents, total] = await qb.getManyAndCount();

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    documents: documents.map((document) => serializeDocument(document)),
  };
};

export const getDocumentService = async (id: number, currentUser?: CurrentUser) => {
  const document = await documentRepository().findOne({
    where: { id, status: DocumentStatus.ACTIVE },
    relations: { owner: true, category: true },
  });

  if (!document) throw new AppError("Document introuvable", 404);

  const hasAccess = await canReadDocument(document, currentUser);

  return serializeDocument(document, hasAccess);
};

export const createDocumentService = async (
  body: DocumentBody,
  file: UploadedPdfFile | undefined,
  currentUser: CurrentUser
) => {
  if (!file) {
    throw new AppError("Le fichier PDF est obligatoire", 400);
  }

  const uploadedFilePath = normalizeUploadedPath(file);
  const { title, description, categoryId } = body;
  const price = Number(body.price || 0);
  const isFreeInput = parseBoolean(body.isFree);
  const isFree = isFreeInput !== undefined ? isFreeInput : price <= 0;

  if (!title) {
    await deleteLocalFile(uploadedFilePath);
    throw new AppError("Le titre est obligatoire", 400);
  }

  if (!isFree && price <= 0) {
    await deleteLocalFile(uploadedFilePath);
    throw new AppError("Le prix doit etre superieur a 0 pour un document payant", 400);
  }

  const owner = await userRepository().findOne({ where: { id: currentUser.id } });
  if (!owner) {
    await deleteLocalFile(uploadedFilePath);
    throw new AppError("Utilisateur introuvable", 404);
  }

  let category: Category | null = null;
  if (categoryId) {
    category = await categoryRepository().findOne({ where: { id: Number(categoryId) } });
    if (!category) {
      await deleteLocalFile(uploadedFilePath);
      throw new AppError("Categorie introuvable", 404);
    }
  }

  const document = documentRepository().create({
    title,
    description,
    filePath: uploadedFilePath,
    originalFileName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    price: isFree ? 0 : price,
    isFree,
    owner,
    category: category || undefined,
  });

  await documentRepository().save(document);

  const savedDocument = await documentRepository().findOne({
    where: { id: document.id },
    relations: { owner: true, category: true },
  });

  return serializeDocument(savedDocument!);
};

export const updateDocumentService = async (
  id: number,
  body: DocumentBody,
  file: UploadedPdfFile | undefined,
  currentUser: CurrentUser
) => {
  const document = await documentRepository().findOne({
    where: { id },
    relations: { owner: true, category: true },
  });

  if (!document || document.status === DocumentStatus.DELETED) {
    if (file) await deleteLocalFile(normalizeUploadedPath(file));
    throw new AppError("Document introuvable", 404);
  }

  if (!canManageDocument(document, currentUser)) {
    if (file) await deleteLocalFile(normalizeUploadedPath(file));
    throw new AppError("Vous ne pouvez pas modifier ce document", 403);
  }

  const oldFilePath = document.filePath;

  if (body.title !== undefined) document.title = body.title;
  if (body.description !== undefined) document.description = body.description;

  if (body.categoryId !== undefined) {
    if (!body.categoryId) {
      document.category = null as any;
    } else {
      const category = await categoryRepository().findOne({ where: { id: Number(body.categoryId) } });
      if (!category) {
        if (file) await deleteLocalFile(normalizeUploadedPath(file));
        throw new AppError("Categorie introuvable", 404);
      }
      document.category = category;
    }
  }

  const isFreeInput = parseBoolean(body.isFree);
  if (isFreeInput !== undefined) document.isFree = isFreeInput;

  if (body.price !== undefined) {
    document.price = Number(body.price);
  }

  if (document.isFree) {
    document.price = 0;
  } else if (Number(document.price) <= 0) {
    if (file) await deleteLocalFile(normalizeUploadedPath(file));
    throw new AppError("Le prix doit etre superieur a 0 pour un document payant", 400);
  }

  if (file) {
    document.filePath = normalizeUploadedPath(file);
    document.originalFileName = file.originalname;
    document.mimeType = file.mimetype;
    document.size = file.size;
  }

  await documentRepository().save(document);

  if (file) {
    await deleteLocalFile(oldFilePath);
  }

  const updatedDocument = await documentRepository().findOne({
    where: { id: document.id },
    relations: { owner: true, category: true },
  });

  return serializeDocument(updatedDocument!);
};

export const deleteDocumentService = async (id: number, currentUser: CurrentUser) => {
  const document = await documentRepository().findOne({
    where: { id },
    relations: { owner: true },
  });

  if (!document || document.status === DocumentStatus.DELETED) {
    throw new AppError("Document introuvable", 404);
  }

  if (!canManageDocument(document, currentUser)) {
    throw new AppError("Vous ne pouvez pas supprimer ce document", 403);
  }

  document.status = DocumentStatus.DELETED;
  await documentRepository().save(document);
  await deleteLocalFile(document.filePath);
};

const prepareDocumentFile = async (id: number, currentUser: CurrentUser | undefined, action: "view" | "download") => {
  const document = await documentRepository().findOne({
    where: { id },
    relations: { owner: true },
  });

  if (!document || document.status !== DocumentStatus.ACTIVE) {
    throw new AppError("Document introuvable", 404);
  }

  const allowed = await canReadDocument(document, currentUser);
  if (!allowed) {
    throw new AppError("Acces refuse. Achetez ce document ou connectez-vous", currentUser ? 403 : 401);
  }

  const absolutePath = getAbsoluteFilePath(document.filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new AppError("Fichier PDF introuvable sur le serveur", 404);
  }

  if (action === "view") document.viewCount += 1;
  if (action === "download") document.downloadCount += 1;
  await documentRepository().save(document);

  return {
    absolutePath,
    originalFileName: document.originalFileName,
  };
};

export const prepareDocumentViewService = async (id: number, currentUser?: CurrentUser) => {
  return prepareDocumentFile(id, currentUser, "view");
};

export const prepareDocumentDownloadService = async (id: number, currentUser?: CurrentUser) => {
  return prepareDocumentFile(id, currentUser, "download");
};

export const adminGetDocumentsService = async (query: DocumentListQuery) => {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 50), 1), 100);
  const skip = (page - 1) * limit;

  const qb = documentRepository()
    .createQueryBuilder("document")
    .leftJoinAndSelect("document.owner", "owner")
    .leftJoinAndSelect("document.category", "category")
    .orderBy("document.createdAt", "DESC")
    .skip(skip)
    .take(limit);

  const [documents, total] = await qb.getManyAndCount();
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    documents: documents.map((d) => serializeDocument(d)),
  };
};

export const adminSetDocumentStatusService = async (id: number, status: DocumentStatus) => {
  if (!Object.values(DocumentStatus).includes(status)) {
    throw new AppError("Statut invalide", 400);
  }
  const document = await documentRepository().findOne({
    where: { id },
    relations: { owner: true, category: true },
  });
  if (!document) throw new AppError("Document introuvable", 404);
  document.status = status;
  await documentRepository().save(document);
  return serializeDocument(document);
};

export const getMyDocumentsService = async (currentUser: CurrentUser) => {
  const documents = await documentRepository().find({
    where: { owner: { id: currentUser.id } },
    relations: { owner: true, category: true },
    order: { createdAt: "DESC" },
  });

  return documents.map((document) => serializeDocument(document));
};

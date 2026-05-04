import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  adminGetDocumentsService,
  adminSetDocumentStatusService,
  createDocumentService,
  deleteDocumentService,
  getDocumentService,
  getDocumentsService,
  getMyDocumentsService,
  prepareDocumentDownloadService,
  prepareDocumentViewService,
  updateDocumentService,
} from "../services/document.service";

export const getDocuments = asyncHandler(async (req: Request, res: Response) => {
  const result = await getDocumentsService(req.query);
  res.json({ success: true, ...result });
});

export const getDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await getDocumentService(Number(req.params.id), req.user);
  res.json({ success: true, document });
});

export const createDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await createDocumentService(req.body, req.file, req.user!);
  res.status(201).json({ success: true, message: "Document cree", document });
});

export const updateDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await updateDocumentService(Number(req.params.id), req.body, req.file, req.user!);
  res.json({ success: true, message: "Document modifie", document });
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  await deleteDocumentService(Number(req.params.id), req.user!);
  res.json({ success: true, message: "Document supprime" });
});

export const viewDocument = asyncHandler(async (req: Request, res: Response) => {
  const file = await prepareDocumentViewService(Number(req.params.id), req.user);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${file.originalFileName}"`);
  res.sendFile(file.absolutePath);
});

export const downloadDocument = asyncHandler(async (req: Request, res: Response) => {
  const file = await prepareDocumentDownloadService(Number(req.params.id), req.user);
  res.download(file.absolutePath, file.originalFileName);
});

export const getMyDocuments = asyncHandler(async (req: Request, res: Response) => {
  const documents = await getMyDocumentsService(req.user!);
  res.json({ success: true, count: documents.length, documents });
});

export const adminGetDocuments = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminGetDocumentsService(req.query);
  res.json({ success: true, ...result });
});

export const adminSetDocumentStatus = asyncHandler(async (req: Request, res: Response) => {
  const document = await adminSetDocumentStatusService(Number(req.params.id), req.body.status);
  res.json({ success: true, message: "Statut modifie", document });
});

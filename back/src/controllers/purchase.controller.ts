import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  buyDocumentService,
  getAllPurchasesService,
  getMyPurchasesService,
} from "../services/purchase.service";

export const buyDocument = asyncHandler(async (req: Request, res: Response) => {
  const result = await buyDocumentService(Number(req.params.documentId), req.user!.id, req.body);

  res.status(result.statusCode).json({
    success: true,
    message: result.message,
    payment: result.payment,
    purchase: result.purchase,
  });
});

export const getMyPurchases = asyncHandler(async (req: Request, res: Response) => {
  const purchases = await getMyPurchasesService(req.user!.id);
  res.json({ success: true, count: purchases.length, purchases });
});

export const getAllPurchases = asyncHandler(async (_req: Request, res: Response) => {
  const purchases = await getAllPurchasesService();
  res.json({ success: true, count: purchases.length, purchases });
});

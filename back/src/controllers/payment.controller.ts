import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getAllPaymentsService, getMyPaymentsService } from "../services/payment.service";

export const getMyPayments = asyncHandler(async (req: Request, res: Response) => {
  const payments = await getMyPaymentsService(req.user!.id);
  res.json({ success: true, count: payments.length, payments });
});

export const getAllPayments = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await getAllPaymentsService();
  res.json({ success: true, count: payments.length, payments });
});

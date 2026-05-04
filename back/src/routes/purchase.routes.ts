import { Router } from "express";
import { buyDocument, getAllPurchases, getMyPurchases } from "../controllers/purchase.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { UserRole } from "../enums/UserRole";

const router = Router();

router.use(protect);

router.post("/documents/:documentId/buy", buyDocument);
router.get("/me", getMyPurchases);
router.get("/", restrictTo(UserRole.ADMIN), getAllPurchases);

export default router;

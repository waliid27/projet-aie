import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes";
import documentRoutes from "./document.routes";
import commentRoutes from "./comment.routes";
import purchaseRoutes from "./purchase.routes";
import paymentRoutes from "./payment.routes";
import favoriteRoutes from "./favorite.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/documents", documentRoutes);
router.use("/", commentRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/payments", paymentRoutes);
router.use("/favorites", favoriteRoutes);

export default router;

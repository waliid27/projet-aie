import { Router } from "express";
import { getAllPayments, getMyPayments } from "../controllers/payment.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { UserRole } from "../enums/UserRole";

const router = Router();

router.use(protect);

router.get("/me", getMyPayments);
router.get("/", restrictTo(UserRole.ADMIN), getAllPayments);

export default router;

import { Router } from "express";
import { changePassword, getMe, listUsers, setUserActive, updateMe } from "../controllers/user.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { UserRole } from "../enums/UserRole";

const router = Router();

router.use(protect);

router.get("/me", getMe);
router.patch("/me", updateMe);
router.patch("/me/password", changePassword);

router.get("/", restrictTo(UserRole.ADMIN), listUsers);
router.patch("/:id/active", restrictTo(UserRole.ADMIN), setUserActive);

export default router;

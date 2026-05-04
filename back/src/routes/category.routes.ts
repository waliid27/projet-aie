import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { UserRole } from "../enums/UserRole";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", protect, restrictTo(UserRole.ADMIN), createCategory);
router.patch("/:id", protect, restrictTo(UserRole.ADMIN), updateCategory);
router.delete("/:id", protect, restrictTo(UserRole.ADMIN), deleteCategory);

export default router;

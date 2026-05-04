import { Router } from "express";
import { addFavorite, getMyFavorites, removeFavorite } from "../controllers/favorite.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/me", getMyFavorites);
router.post("/documents/:documentId", addFavorite);
router.delete("/documents/:documentId", removeFavorite);

export default router;

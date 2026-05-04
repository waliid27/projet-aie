import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  addFavoriteService,
  getMyFavoritesService,
  removeFavoriteService,
} from "../services/favorite.service";

export const getMyFavorites = asyncHandler(async (req: Request, res: Response) => {
  const favorites = await getMyFavoritesService(req.user!.id);
  res.json({ success: true, count: favorites.length, favorites });
});

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const result = await addFavoriteService(Number(req.params.documentId), req.user!.id);

  if (result.alreadyExists) {
    return res.json({ success: true, message: "Document deja dans les favoris", favorite: result.favorite });
  }

  res.status(201).json({ success: true, message: "Ajoute aux favoris", favorite: result.favorite });
});

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  await removeFavoriteService(Number(req.params.documentId), req.user!.id);
  res.json({ success: true, message: "Retire des favoris" });
});

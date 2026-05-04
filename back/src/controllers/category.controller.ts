import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
} from "../services/category.service";

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await getCategoriesService();
  res.json({ success: true, count: categories.length, categories });
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await getCategoryService(Number(req.params.id));
  res.json({ success: true, category });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await createCategoryService(req.body);
  res.status(201).json({ success: true, message: "Categorie creee", category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await updateCategoryService(Number(req.params.id), req.body);
  res.json({ success: true, message: "Categorie modifiee", category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await deleteCategoryService(Number(req.params.id));
  res.json({ success: true, message: "Categorie supprimee" });
});

import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/Category";
import { AppError } from "../utils/AppError";

interface CategoryInput {
  name?: string;
  description?: string;
}

const categoryRepository = () => AppDataSource.getRepository(Category);

export const getCategoriesService = async () => {
  return categoryRepository().find({ order: { name: "ASC" } });
};

export const getCategoryService = async (id: number) => {
  const category = await categoryRepository().findOne({ where: { id } });

  if (!category) throw new AppError("Categorie introuvable", 404);

  return category;
};

export const createCategoryService = async ({ name, description }: CategoryInput) => {
  if (!name) throw new AppError("Le nom est obligatoire", 400);

  const category = categoryRepository().create({ name, description });
  return categoryRepository().save(category);
};

export const updateCategoryService = async (id: number, { name, description }: CategoryInput) => {
  const category = await getCategoryService(id);

  category.name = name ?? category.name;
  category.description = description ?? category.description;

  return categoryRepository().save(category);
};

export const deleteCategoryService = async (id: number) => {
  const category = await getCategoryService(id);
  await categoryRepository().remove(category);
};

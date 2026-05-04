import { AppDataSource } from "../config/data-source";
import { Document } from "../entities/Document";
import { Favorite } from "../entities/Favorite";
import { User } from "../entities/User";
import { DocumentStatus } from "../enums/DocumentStatus";
import { AppError } from "../utils/AppError";

const favoriteRepository = () => AppDataSource.getRepository(Favorite);
const documentRepository = () => AppDataSource.getRepository(Document);
const userRepository = () => AppDataSource.getRepository(User);

export const getMyFavoritesService = async (userId: number) => {
  return favoriteRepository().find({
    where: { user: { id: userId } },
    relations: { document: { category: true, owner: true } },
    order: { createdAt: "DESC" },
  });
};

export const addFavoriteService = async (documentId: number, userId: number) => {
  const document = await documentRepository().findOne({
    where: { id: documentId, status: DocumentStatus.ACTIVE },
  });

  if (!document) throw new AppError("Document introuvable", 404);

  const existingFavorite = await favoriteRepository().findOne({
    where: { user: { id: userId }, document: { id: document.id } },
  });

  if (existingFavorite) {
    return { favorite: existingFavorite, alreadyExists: true };
  }

  const user = await userRepository().findOne({ where: { id: userId } });
  if (!user) throw new AppError("Utilisateur introuvable", 404);

  const favorite = favoriteRepository().create({ user, document });
  await favoriteRepository().save(favorite);

  return { favorite, alreadyExists: false };
};

export const removeFavoriteService = async (documentId: number, userId: number) => {
  const favorite = await favoriteRepository().findOne({
    where: { user: { id: userId }, document: { id: documentId } },
  });

  if (!favorite) throw new AppError("Favori introuvable", 404);

  await favoriteRepository().remove(favorite);
};

import { AppDataSource } from "../config/data-source";
import { Document } from "../entities/Document";
import { Purchase } from "../entities/Purchase";
import { UserRole } from "../enums/UserRole";
import { DocumentStatus } from "../enums/DocumentStatus";

interface CurrentUser {
  id: number;
  email: string;
  role: UserRole;
}

export const canManageDocument = (document: Document, user?: CurrentUser) => {
  if (!user) return false;
  return user.role === UserRole.ADMIN || document.owner?.id === user.id;
};

export const canReadDocument = async (document: Document, user?: CurrentUser) => {
  if (document.status !== DocumentStatus.ACTIVE) return false;
  if (document.isFree) return true;
  if (!user) return false;
  if (user.role === UserRole.ADMIN || document.owner?.id === user.id) return true;

  const purchaseRepository = AppDataSource.getRepository(Purchase);
  const purchase = await purchaseRepository.findOne({
    where: {
      user: { id: user.id },
      document: { id: document.id },
    },
  });

  return Boolean(purchase);
};

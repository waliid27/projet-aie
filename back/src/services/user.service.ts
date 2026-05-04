import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { AppError } from "../utils/AppError";
import { sanitizeUser } from "./serializers";

interface UpdateMeBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

interface ChangePasswordBody {
  oldPassword?: string;
  newPassword?: string;
}

const userRepository = () => AppDataSource.getRepository(User);
const normalizeEmail = (email: string) => String(email).toLowerCase().trim();

export const getMeService = async (userId: number) => {
  const user = await userRepository().findOne({ where: { id: userId } });

  if (!user) throw new AppError("Utilisateur introuvable", 404);

  return sanitizeUser(user);
};

export const updateMeService = async (userId: number, { firstName, lastName, email, phone, dateOfBirth }: UpdateMeBody) => {
  const user = await userRepository().findOne({ where: { id: userId } });

  if (!user) throw new AppError("Utilisateur introuvable", 404);

  if (firstName) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (email) user.email = normalizeEmail(email);
  if (phone !== undefined) user.phone = phone || null;
  if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth || null;

  await userRepository().save(user);

  return sanitizeUser(user);
};

export const changePasswordService = async (
  userId: number,
  { oldPassword, newPassword }: ChangePasswordBody
) => {
  if (!oldPassword || !newPassword) {
    throw new AppError("Ancien et nouveau mot de passe sont obligatoires", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("Le nouveau mot de passe doit contenir au moins 6 caracteres", 400);
  }

  const user = await userRepository()
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.id = :id", { id: userId })
    .getOne();

  if (!user) throw new AppError("Utilisateur introuvable", 404);

  const valid = await user.comparePassword(oldPassword);
  if (!valid) throw new AppError("Ancien mot de passe incorrect", 401);

  user.password = newPassword;
  await userRepository().save(user);
};

export const listUsersService = async () => {
  const users = await userRepository().find({ order: { createdAt: "DESC" } });
  return users.map(sanitizeUser);
};

export const setUserActiveService = async (id: number, isActive: boolean) => {
  const user = await userRepository().findOne({ where: { id } });

  if (!user) throw new AppError("Utilisateur introuvable", 404);

  user.isActive = Boolean(isActive);
  await userRepository().save(user);

  return sanitizeUser(user);
};

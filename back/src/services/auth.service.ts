import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { AppError } from "../utils/AppError";
import { signToken } from "../utils/jwt";
import { sanitizeUser } from "./serializers";

interface RegisterInput {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const userRepository = () => AppDataSource.getRepository(User);
const normalizeEmail = (email: string) => String(email).toLowerCase().trim();

export const registerUser = async ({ firstName, lastName, email, password, phone, dateOfBirth }: RegisterInput) => {
  if (!firstName || !email || !password) {
    throw new AppError("Prenom, email et mot de passe sont obligatoires", 400);
  }

  if (password.length < 6) {
    throw new AppError("Le mot de passe doit contenir au moins 6 caracteres", 400);
  }

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await userRepository().findOne({ where: { email: normalizedEmail } });

  if (existingUser) {
    throw new AppError("Cet email est deja utilise", 409);
  }

  const user = userRepository().create({
    firstName,
    lastName: lastName || "",
    email: normalizedEmail,
    password,
    phone: phone || null,
    dateOfBirth: dateOfBirth || null,
  });

  await userRepository().save(user);

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  if (!email || !password) {
    throw new AppError("Email et mot de passe sont obligatoires", 400);
  }

  const user = await userRepository()
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", { email: normalizeEmail(email) })
    .getOne();

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  if (!user.isActive) {
    throw new AppError("Votre compte est desactive", 403);
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return {
    token,
    user: sanitizeUser(user),
  };
};

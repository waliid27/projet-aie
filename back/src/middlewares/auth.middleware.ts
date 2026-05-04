import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserRole } from "../enums/UserRole";
import { AppError } from "../utils/AppError";
import { getAuthTokenFromCookie } from "../utils/authCookie";
import { verifyToken } from "../utils/jwt";

const extractToken = (req: Request): string | null => {
  const cookieToken = getAuthTokenFromCookie(req);
  if (cookieToken) return cookieToken;

  // Fallback pratique pour Postman ou une application mobile.
  // Le frontend web doit utiliser le cookie httpOnly.
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    return next(new AppError("Vous devez etre connecte", 401));
  }

  try {
    const decoded = verifyToken(token);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id, isActive: true } });

    if (!user) {
      return next(new AppError("Utilisateur introuvable ou desactive", 401));
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (_error) {
    next(new AppError("Session invalide ou expiree", 401));
  }
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);

    if (!token) return next();

    const decoded = verifyToken(token);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id, isActive: true } });

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    }

    next();
  } catch (_error) {
    next();
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Acces refuse", 403));
    }
    next();
  };
};

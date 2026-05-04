import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookie";
import { loginUser, registerUser } from "../services/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { token, user } = await registerUser(req.body);
  setAuthCookie(res, token);
  console.log("BODY REGISTER:", req.body);
  res.status(201).json({
    success: true,
    message: "Compte cree avec succes",
    user,
  });
  console.log("BODY REGISTER:", req.body);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { token, user } = await loginUser(req.body);
  setAuthCookie(res, token);

  res.json({
    success: true,
    message: "Connexion reussie",
    user,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookie(res);

  res.json({
    success: true,
    message: "Deconnexion reussie",
  });
});

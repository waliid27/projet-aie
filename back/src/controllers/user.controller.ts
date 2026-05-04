import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  changePasswordService,
  getMeService,
  listUsersService,
  setUserActiveService,
  updateMeService,
} from "../services/user.service";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await getMeService(req.user!.id);
  res.json({ success: true, user });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateMeService(req.user!.id, req.body);
  res.json({ success: true, message: "Profil modifie", user });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await changePasswordService(req.user!.id, req.body);
  res.json({ success: true, message: "Mot de passe modifie" });
});

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await listUsersService();
  res.json({ success: true, count: users.length, users });
});

export const setUserActive = asyncHandler(async (req: Request, res: Response) => {
  const user = await setUserActiveService(Number(req.params.id), Boolean(req.body.isActive));
  res.json({ success: true, message: "Etat utilisateur modifie", user });
});

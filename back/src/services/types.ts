import { UserRole } from "../enums/UserRole";

export interface CurrentUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface UploadedPdfFile {
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
}

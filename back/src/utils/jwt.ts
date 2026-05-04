import jwt from "jsonwebtoken";
import { UserRole } from "../enums/UserRole";

export interface TokenPayload {
  id: number;
  email: string;
  role: UserRole;
}

export const signToken = (payload: TokenPayload) => {
  const secret = process.env.JWT_SECRET || "dev_secret";
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET || "dev_secret";
  return jwt.verify(token, secret) as TokenPayload;
};

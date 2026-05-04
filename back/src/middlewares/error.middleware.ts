import { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import { AppError } from "../utils/AppError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route introuvable: ${req.originalUrl}`, 404));
};

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Erreur serveur";

  if (err instanceof QueryFailedError) {
    const mysqlError = err as any;

    if (mysqlError.code === "ER_DUP_ENTRY") {
      statusCode = 409;
      message = "Cette ressource existe deja";
    }
  }

  if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

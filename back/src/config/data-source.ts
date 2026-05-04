import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { Category } from "../entities/Category";
import { Document } from "../entities/Document";
import { Comment } from "../entities/Comment";
import { Payment } from "../entities/Payment";
import { Purchase } from "../entities/Purchase";
import { Favorite } from "../entities/Favorite";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pdf_app",
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: process.env.DB_LOGGING === "true",
  entities: [User, Category, Document, Comment, Payment, Purchase, Favorite],
});

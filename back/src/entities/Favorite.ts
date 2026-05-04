import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Document } from "./Document";

@Entity("favorites")
@Unique(["user", "document"])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Document, (document) => document.favorites, { nullable: false, onDelete: "CASCADE" })
  document: Document;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}

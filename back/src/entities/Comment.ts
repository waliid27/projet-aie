import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Document } from "./Document";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "int" })
  rating: number;

  @ManyToOne(() => User, (user) => user.comments, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Document, (document) => document.comments, { nullable: false, onDelete: "CASCADE" })
  document: Document;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

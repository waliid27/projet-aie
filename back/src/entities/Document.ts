import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Comment } from "./Comment";
import { Purchase } from "./Purchase";
import { Favorite } from "./Favorite";
import { Payment } from "./Payment";
import { DocumentStatus } from "../enums/DocumentStatus";

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 180 })
  title: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "file_path" })
  filePath: string;

  @Column({ name: "original_file_name" })
  originalFileName: string;

  @Column({ name: "mime_type", default: "application/pdf" })
  mimeType: string;

  @Column({ type: "bigint", default: 0 })
  size: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ name: "is_free", default: true })
  isFree: boolean;

  @Column({ type: "enum", enum: DocumentStatus, default: DocumentStatus.ACTIVE })
  status: DocumentStatus;

  @Column({ name: "view_count", default: 0 })
  viewCount: number;

  @Column({ name: "download_count", default: 0 })
  downloadCount: number;

  @Column({ name: "rating_count", default: 0 })
  ratingCount: number;

  @Column({ name: "average_rating", type: "decimal", precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @ManyToOne(() => User, (user) => user.documents, { nullable: false, onDelete: "CASCADE" })
  owner: User;

  @ManyToOne(() => Category, (category) => category.documents, { nullable: true, onDelete: "SET NULL" })
  category?: Category;

  @OneToMany(() => Comment, (comment) => comment.document)
  comments: Comment[];

  @OneToMany(() => Purchase, (purchase) => purchase.document)
  purchases: Purchase[];

  @OneToMany(() => Payment, (payment) => payment.document)
  payments: Payment[];

  @OneToMany(() => Favorite, (favorite) => favorite.document)
  favorites: Favorite[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

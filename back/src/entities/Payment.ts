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
import { PaymentStatus } from "../enums/PaymentStatus";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ default: "manual" })
  provider: string;

  @Column({ nullable: true })
  reference?: string;

  @ManyToOne(() => User, (user) => user.payments, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Document, (document) => document.payments, { nullable: false, onDelete: "CASCADE" })
  document: Document;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

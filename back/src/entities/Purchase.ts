import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Document } from "./Document";
import { Payment } from "./Payment";

@Entity("purchases")
@Unique(["user", "document"])
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.purchases, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Document, (document) => document.purchases, { nullable: false, onDelete: "CASCADE" })
  document: Document;

  @OneToOne(() => Payment, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  payment?: Payment;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}

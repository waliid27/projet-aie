import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import { UserRole } from "../enums/UserRole";
import { Document } from "./Document";
import { Comment } from "./Comment";
import { Purchase } from "./Purchase";
import { Payment } from "./Payment";
import { Favorite } from "./Favorite";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name", length: 80 })
  firstName: string;

  @Column({ name: "last_name", length: 80, default: "" })
  lastName: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  @Column({ length: 30, nullable: true, default: null })
  phone: string | null;

  @Column({ name: "date_of_birth", type: "date", nullable: true, default: null })
  dateOfBirth: string | null;

  @Column({ unique: true, length: 160 })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @OneToMany(() => Document, (document) => document.owner)
  documents: Document[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith("$2")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}

import { IsEmail, Length } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  @Column()
  @Length(2, 200)
  about: string;

  @Column()
  avatar: number;

  @Column({ unique: true, select: false })
  @IsEmail()
  email: string;

  @Column({ select: false })
  //@Exclude()
  password: string;

  @Column()
  wishes: number;

  @Column()
  offers: number;

  @Column()
  whishlists: number;
}

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from '../userRole.enum';
import { Borrower } from 'src/borrower/entities/borrower.entity';
import { Notification } from 'src/notification/entities/notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({nullable: true })
  profilePic: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @OneToMany(() => Borrower, borrower => borrower.user)
  borrowers: Borrower[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
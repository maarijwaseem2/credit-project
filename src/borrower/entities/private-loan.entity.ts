import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Borrower } from './borrower.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class PrivateLoan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  value: number;

  @ManyToOne(() => Borrower, (borrower) => borrower.privateLoans)
  @Exclude({ toPlainOnly: true })
  borrower: Borrower;
}

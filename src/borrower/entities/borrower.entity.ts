import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PersonalAsset } from './personal-asset.entity';
import { PrivateLoan } from './private-loan.entity';
import { Exclude, Type } from 'class-transformer';

@Entity()
export class Borrower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  occupation: string;

  @Column()
  sin: string;

  @Column('decimal', { precision: 10, scale: 2 })
  annualIncome: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amountBorrowed: number;

  @Column('decimal', { precision: 5, scale: 2 })
  interestRate: number;

  @Column()
  term: number;

  @OneToMany(() => PersonalAsset, (personalAsset) => personalAsset.borrower, { cascade: true })
  @Type(() => PersonalAsset)
  personalAssets: PersonalAsset[];

  @OneToMany(() => PrivateLoan, (privateLoan) => privateLoan.borrower, { cascade: true })
  @Type(() => PrivateLoan)
  privateLoans: PrivateLoan[];

  @ManyToOne(() => User, user => user.borrowers)
  @Exclude({ toPlainOnly: true })
  user: User;
}

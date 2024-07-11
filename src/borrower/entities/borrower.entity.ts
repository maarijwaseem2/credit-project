import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Borrower {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'text', nullable: true })
  personalAssets: string; 

  @Column({ type: 'text', nullable: true })
  privateLoan: string;

  @ManyToOne(() => User, user => user.borrowers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  setPersonalAssets(assets: { description: string; value: number }[]) {
    this.personalAssets = JSON.stringify(assets);
  }

  getPersonalAssets(): { description: string; value: number }[] | null {
    return this.personalAssets ? JSON.parse(this.personalAssets) : null;
  }

  setPrivateLoan(loan: { description: string; value: number }[]) {
    this.privateLoan = JSON.stringify(loan);
  }

  getPrivateLoan(): { description: string; value: number }[] | null {
    return this.privateLoan ? JSON.parse(this.privateLoan) : null;
  }
}

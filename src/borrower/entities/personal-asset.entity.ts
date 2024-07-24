import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Borrower } from './borrower.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class PersonalAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  value: number;

  @ManyToOne(() => Borrower, (borrower) => borrower.personalAssets)
  @Exclude({ toPlainOnly: true })
  borrower: Borrower;
}

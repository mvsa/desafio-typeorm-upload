import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Category from './Category';

enum Types {
  Income = 'income',
  Outcome = 'outcome',
}

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: Types;

  @Column()
  value: number;

  @Column()
  category_id: string;

  // @ManyToOne(()=>Category)
  // @JoinColumn({ name: 'category_id' })

  @OneToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;

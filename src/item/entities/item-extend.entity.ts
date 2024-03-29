import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity('item_extend')
export class Extend {
  @ManyToOne(() => Item, (item) => item.extends, {
    primary: true,
    onDelete: 'CASCADE',
  })
  item?: Item;

  @PrimaryColumn({ type: 'char', length: 1 })
  marketCode: string;

  @PrimaryColumn({ type: 'char', length: 4 })
  marketSubCode: string;

  @Column({ type: 'varchar' })
  info: string;

  @CreateDateColumn()
  createdAt?: Date;
}

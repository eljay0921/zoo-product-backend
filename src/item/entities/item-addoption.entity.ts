import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity('item_addoption')
export class Addoption {
  @ManyToOne(() => Item, (item) => item.addOptions, {
    primary: true,
    onDelete: 'CASCADE',
  })
  item?: Item;

  @PrimaryColumn({ type: 'smallint' })
  order: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  value: string;

  @Column()
  count: number;

  @Column()
  price: number;

  @CreateDateColumn()
  createdAt?: Date;
}

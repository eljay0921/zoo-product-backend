import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ItemImageExtend } from '../json-types/item-image-extend.type';
import { Item } from './item.entity';

@Entity('item_image')
export class Image {
  @ManyToOne(() => Item, (item) => item.images, {
    primary: true,
    onDelete: 'CASCADE',
  })
  item?: Item;

  @PrimaryColumn({ type: 'tinyint' })
  order: number;

  @Column({ type: 'varchar', length: 1000 })
  url: string;

  @Column('simple-json', { nullable: true })
  extend?: ItemImageExtend = {};

  @CreateDateColumn()
  createdAt?: Date;
}

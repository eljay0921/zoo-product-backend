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
  @ManyToOne(() => Item, (master) => master.images, {
    primary: true,
    onDelete: 'CASCADE',
  })
  masterItem?: Item;

  @PrimaryColumn({ type: 'tinyint' })
  order: number;

  @Column({ type: 'varchar', length: 1000 })
  url: string;

  @Column('simple-json', { nullable: true })
  extend?: ItemImageExtend = {};

  @CreateDateColumn()
  createdAt?: Date;
}

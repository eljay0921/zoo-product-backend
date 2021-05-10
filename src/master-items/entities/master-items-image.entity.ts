import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MasterItemImageExtendInfo } from '../json-types/master-items-image-extendInfo.type';
import { MasterItem } from './master-items.entity';

@Entity('master_image')
export class MasterItemImage {
  @ManyToOne(() => MasterItem, (master) => master.images, {
    primary: true,
    onDelete: 'CASCADE',
  })
  masterItem?: MasterItem;

  @PrimaryColumn({ type: 'tinyint' })
  order: number;

  @Column({ type: 'varchar', length: 1000 })
  url: string;

  @Column('simple-json', { nullable: true })
  extendInfo?: MasterItemImageExtendInfo = {};

  @CreateDateColumn()
  createdAt?: Date;
}

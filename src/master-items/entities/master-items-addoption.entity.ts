import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MasterItem } from './master-items.entity';

@Entity('master_addoption')
export class MasterItemAddoption {
  @ManyToOne(() => MasterItem, (master) => master.addOptions, {
    primary: true,
    onDelete: 'CASCADE',
  })
  masterItem?: MasterItem;

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

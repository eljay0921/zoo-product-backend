import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { MasterItem } from './master-items.entity';

@Entity('master_extend')
export class MasterItemExtend {
  @ManyToOne(() => MasterItem, (master) => master.extends, {
    primary: true,
    onDelete: 'CASCADE',
  })
  masterItem?: MasterItem;

  @PrimaryColumn({ type: 'char', length: 1 })
  marketCode: string;

  @PrimaryColumn({ type: 'char', length: 4 })
  marketSubCode: string;

  @Column({ type: 'varchar' })
  info: string;

  @CreateDateColumn()
  createdAt?: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MasterItemSelectionDetailExtend } from '../json-types/master-items-selection-detail-valueInfo.type';
import { MasterItemSelectionBase } from './master-items-selection-base.entity';

@Entity('selection_detail')
export class MasterItemSelectionDetail {
  @PrimaryColumn({ type: 'smallint' })
  order: number;

  @ManyToOne(() => MasterItemSelectionBase, (base) => base.details, {
    primary: true,
    onDelete: 'CASCADE',
  })
  selectionBase?: MasterItemSelectionBase;

  @Column()
  count: number;

  @Column()
  price: number;

  @Column({ type: 'simple-array', nullable: true })
  values?: string[];

  @Column({ type: 'varchar', length: 40, nullable: true })
  userCode?: string;

  @Column({ type: 'simple-json', nullable: true })
  extendInfo?: MasterItemSelectionDetailExtend;

  @CreateDateColumn()
  createdAt?: Date;
}

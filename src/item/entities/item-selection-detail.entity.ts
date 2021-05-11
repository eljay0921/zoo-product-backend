import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Extend } from '../json-types/item-selection-detail-extend.type';
import { Selection } from './item-selection.entity';

@Entity('item_selection_detail')
export class SelectionDetail {
  @ManyToOne(() => Selection, (base) => base.details, {
    primary: true,
    onDelete: 'CASCADE',
  })
  selection?: Selection;

  @PrimaryColumn({ type: 'smallint' })
  order: number;

  @Column()
  count: number;

  @Column()
  price: number;

  @Column({ type: 'simple-array', nullable: true })
  values?: string[];

  @Column({ type: 'varchar', length: 40, nullable: true })
  userCode?: string;

  @Column({ type: 'simple-json', nullable: true })
  extendInfo?: Extend;

  @CreateDateColumn()
  createdAt?: Date;
}

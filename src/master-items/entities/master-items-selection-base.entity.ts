import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MasterItemSelectionDetail } from './master-items-selection-detail.entity';
import { MasterItem } from './master-items.entity';

enum SelectionType {
  Combined,
  Standard,
  Input,
}

@Entity('master_selection')
export class MasterItemSelectionBase {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  selectionId?: number;

  @OneToOne(() => MasterItem, (master) => master.selection, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  masterItem?: MasterItem;

  @Column()
  type: SelectionType;

  @Column('simple-array')
  options: string[];

  @CreateDateColumn()
  createAt?: Date;

  @OneToMany(
    () => MasterItemSelectionDetail,
    (detail) => detail.selectionBase,
    { cascade: true },
  )
  details?: MasterItemSelectionDetail[];
}

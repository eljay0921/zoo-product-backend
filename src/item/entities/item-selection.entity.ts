import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SelectionDetail } from './item-selection-detail.entity';
import { Item } from './item.entity';

enum SelectionType {
  Combined,
  Standard,
  Input,
}

@Entity('item_selection')
export class Selection {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id?: number;

  @PrimaryColumn()
  type: SelectionType;

  @ManyToOne(() => Item, (item) => item.selections, {
    primary: true,
    onDelete: 'CASCADE',
  })
  item?: Item;

  @Column('simple-array')
  options: string[];

  @CreateDateColumn()
  createAt?: Date;

  @OneToMany(() => SelectionDetail, (detail) => detail.selection, {
    cascade: true,
  })
  details?: SelectionDetail[];
}

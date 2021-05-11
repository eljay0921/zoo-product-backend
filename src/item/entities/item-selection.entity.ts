import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
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

  @OneToOne(() => Item, (item) => item.selection, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  item?: Item;

  @Column()
  type: SelectionType;

  @Column('simple-array')
  options: string[];

  @CreateDateColumn()
  createAt?: Date;

  @OneToMany(
    () => SelectionDetail,
    (detail) => detail.selection,
    { cascade: true },
  )
  details?: SelectionDetail[];
}

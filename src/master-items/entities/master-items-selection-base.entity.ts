import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
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

registerEnumType(SelectionType, { name: 'SelectionType' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MasterItemSelectionBase {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id?: number;

  @OneToOne(() => MasterItem)
  @JoinColumn()
  masterItem: MasterItem;

  @Column()
  type: SelectionType;

  @Column()
  options: string;

  @CreateDateColumn()
  createAt?: Date;

  @OneToMany(() => MasterItemSelectionDetail, (detail) => detail.base)
  @Field((type) => [MasterItemSelectionDetail], { nullable: true })
  details?: MasterItemSelectionDetail[];
}

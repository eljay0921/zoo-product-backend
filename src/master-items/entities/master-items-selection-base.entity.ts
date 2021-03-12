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
  selectionId?: number;

  @OneToOne(() => MasterItem, (master) => master.selectionBase)
  @JoinColumn()
  @Field(() => MasterItem, { nullable: true })
  masterItem?: MasterItem;

  @Column()
  @Field(() => SelectionType)
  type: SelectionType;

  @Column()
  @Field(() => String)
  options: string;

  @CreateDateColumn()
  @Field(() => Date)
  createAt?: Date;

  @OneToMany(() => MasterItemSelectionDetail, (detail) => detail.selectionBase)
  @Field((type) => [MasterItemSelectionDetail], { nullable: true })
  details?: MasterItemSelectionDetail[];
}

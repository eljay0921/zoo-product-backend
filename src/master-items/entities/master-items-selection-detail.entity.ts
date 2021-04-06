import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MasterItemSelectionDetailExtend } from '../json-types/master-items-selection-detail-valueInfo.type';
import { MasterItemSelectionBase } from './master-items-selection-base.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity('selection_detail')
export class MasterItemSelectionDetail {
  @PrimaryColumn({ type: 'smallint' })
  @Field(() => Number)
  order: number;

  @ManyToOne(() => MasterItemSelectionBase, (base) => base.details, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @Field(() => MasterItemSelectionBase)
  selectionBase?: MasterItemSelectionBase;

  @Column()
  @Field(() => Number)
  count: number;

  @Column()
  @Field(() => Number)
  price: number;

  @Column({ type: 'simple-array', nullable: true })
  @Field(() => [String], { nullable: true })
  values?: string[];

  @Column({ type: 'varchar', length: 40, nullable: true })
  @Field(() => String)
  userCode?: string;

  @Column({ type: 'simple-json', nullable: true })
  @Field(() => MasterItemSelectionDetailExtend, { nullable: true })
  extendInfo?: MasterItemSelectionDetailExtend;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt?: Date;
}

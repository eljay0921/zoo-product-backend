import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MasterItemSelectionBase } from './master-items-selection-base.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MasterItemSelectionDetail {
  @PrimaryColumn({ type: 'smallint' })
  @Field(() => Number)
  order: number;

  @ManyToOne(() => MasterItemSelectionBase, (base) => base.details, {
    primary: true,
  })
  @Field((type) => MasterItemSelectionBase)
  base: MasterItemSelectionBase;

  @Column({ type: 'mediumint' })
  @Field(() => Number)
  count: number;

  @Column({ type: 'int' })
  @Field(() => Number)
  price: number;

  @Column({ type: 'simple-json' })
  @Field(() => String)
  valueInfo: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  @Field(() => String)
  userCode?: string;

  @Column({ type: 'simple-json', nullable: true })
  @Field(() => String, { nullable: true })
  extendInfo?: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt?: Date;
}

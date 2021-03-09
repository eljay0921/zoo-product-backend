import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MasterItem } from './master-items.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MasterItemAddoption {
  @PrimaryColumn({ type: 'smallint' })
  @Field(() => Number)
  order: number;

  @ManyToOne(() => MasterItem, (master) => master.addOptionInfoList, {
    primary: true,
  })
  @Field((type) => MasterItem)
  masterItem: MasterItem;

  @Column({ length: 100 })
  @Field(() => String)
  name: string;

  @Column({ length: 100 })
  @Field(() => String)
  value: string;

  @Column({ type: 'mediumint' })
  @Field(() => Number)
  count: number;

  @Column({ type: 'int' })
  @Field(() => Number)
  price: number;

  @Column({ type: 'simple-json', nullable: true })
  @Field(() => String, { nullable: true })
  extendInfo?: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt?: Date;
}

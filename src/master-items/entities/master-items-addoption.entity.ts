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
  @Field(() => MasterItem)
  masterItem: MasterItem;

  @Column({ length: 100 })
  @Field(() => String)
  name: string;

  @Column({ length: 100 })
  @Field(() => String)
  value: string;

  @Column()
  @Field(() => Number)
  count: number;

  @Column()
  @Field(() => Number)
  price: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt?: Date;
}

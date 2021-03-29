import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MasterItemImageExtendInfo } from '../json-types/master-items-image-extendInfo.type';
import { MasterItem } from './master-items.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MasterItemImage {
  @ManyToOne(() => MasterItem, (master) => master.images, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @Field(() => MasterItem)
  masterItem?: MasterItem;

  @PrimaryColumn({ type: 'tinyint' })
  @Field(() => Number)
  order: number;

  @Column({ type: 'varchar', length: 1000 })
  @Field(() => String)
  url: string;

  @Column('simple-json', { nullable: true })
  @Field(() => MasterItemImageExtendInfo, { nullable: true })
  extendInfo?: MasterItemImageExtendInfo = {};

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}

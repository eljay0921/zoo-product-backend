import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { MasterItem } from './master-items.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MasterItemExtend {
  @PrimaryColumn({ type: 'char', length: 1 })
  @Field((type) => String)
  marketCode: string;

  @PrimaryColumn({ type: 'char', length: 4 })
  @Field((type) => String)
  marketSubCode: string;

  @ManyToOne(() => MasterItem, (master) => master.extendInfoList)
  @Field((type) => MasterItem)
  masterItem: MasterItem;

  @Column({ type: 'simple-json' })
  @Field((type) => String)
  info: string;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;
}

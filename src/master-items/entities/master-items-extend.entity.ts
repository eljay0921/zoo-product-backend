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
@Entity('master_extend')
export class MasterItemExtend {
  @ManyToOne(() => MasterItem, (master) => master.extendInfoList, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @Field(() => MasterItem)
  masterItem?: MasterItem;

  @PrimaryColumn({ type: 'char', length: 1 })
  @Field(() => String)
  marketCode: string;

  @PrimaryColumn({ type: 'char', length: 4 })
  @Field(() => String)
  marketSubCode: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  info: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt?: Date;
}

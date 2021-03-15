import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MasterItemImageExtendInfo } from '../json-types/master-items-image-extendInfo.type';
import { MasterItem } from './master-items.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MasterItemImage {
  @PrimaryColumn({ type: 'smallint' })
  @Field(() => Number)
  order: number;

  @ManyToOne(() => MasterItem, (master) => master.images, {
    primary: true,
  })
  @Field((type) => MasterItem)
  masterItem: MasterItem;

  @Column()
  @Field(() => String)
  url: string;

  @Column('simple-json', { nullable: true })
  @Field(() => MasterItemImageExtendInfo, { nullable: true })
  extendInfo?: MasterItemImageExtendInfo;
}

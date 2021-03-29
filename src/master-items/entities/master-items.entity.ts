import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MasterItemExtend } from 'src/master-items/entities/master-items-extend.entity';
import { MasterItemAdditionalInfo } from '../json-types/master-items-additionalInfo.type';
import { MasterItemSellingItemInfo } from '../json-types/master-items-sellingItemInfo.type';
import { MasterItemCategoryInfo } from '../json-types/master-items-categoryInfo.type';
import { MasterItemAddoption } from './master-items-addoption.entity';
import { MasterItemImage } from './master-items-image.entity';
import { MasterItemSelectionBase } from './master-items-selection-base.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MasterItem {
  // 개별 DB로 갈 경우 INT로 충분, 통합 DB이면서 파티셔닝(또는 샤딩)할 경우 BIGINT로 고려
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  @Field(() => Number, { nullable: true })
  id?: number;

  @Column({ length: 300 })
  @Field(() => String)
  name: string;

  @Column({ length: 12 })
  @Field(() => String)
  categoryCode: string;

  @Column('simple-json')
  @Field(() => MasterItemCategoryInfo)
  categoryInfo: MasterItemCategoryInfo;

  @Column()
  @Field(() => Number)
  price: number;

  @Column()
  @Field(() => Number)
  count: number;

  @Column({ length: 40, nullable: true })
  @Field(() => String, { nullable: true })
  userCode?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column('simple-json', { nullable: true })
  @Field(() => MasterItemAdditionalInfo, { nullable: true })
  additionalInfo?: MasterItemAdditionalInfo;

  @Column('simple-json', { nullable: true })
  @Field(() => MasterItemSellingItemInfo, { nullable: true })
  sellingItemInfo?: MasterItemSellingItemInfo;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  // relation entities
  @OneToOne(() => MasterItemSelectionBase, (base) => base.masterItem, {
    cascade: true,
  })
  @Field(() => MasterItemSelectionBase, { nullable: true })
  selectionBase?: MasterItemSelectionBase;

  @OneToMany(() => MasterItemImage, (image) => image.masterItem, {
    cascade: true,
  })
  @Field(() => [MasterItemImage], { nullable: true })
  images?: MasterItemImage[];

  @OneToMany(() => MasterItemAddoption, (addOption) => addOption.masterItem, {
    cascade: true,
  })
  @Field(() => [MasterItemAddoption], { nullable: true })
  addOptionInfoList?: MasterItemAddoption[];

  @OneToMany(() => MasterItemExtend, (ext) => ext.masterItem, {
    cascade: true,
  })
  @Field(() => [MasterItemExtend], { nullable: true })
  extendInfoList?: MasterItemExtend[];
}

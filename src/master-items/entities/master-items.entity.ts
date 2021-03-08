import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MasterItemExtend } from 'src/master-items/entities/master-items-extend.entity';
import { MasterItemAdditionalInfo } from '../json-types/master-items-additionalInfo.type';
import { MasterItemSellingItemInfo } from '../json-types/master-items-sellingItemInfo.type';
import { MasterItemCategoryInfo } from '../json-types/master-items-categoryInfo.type';
import { MasterItemSelection } from './master-items-selection.entity';
import { MasterItemAddoption } from './master-items-addoption.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MasterItem {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id?: number;

  @Column({ length: 300 })
  @Field((type) => String)
  name: string;

  @Column({ length: 10 })
  @Field((type) => String)
  categoryCode: string;

  @Column('simple-json')
  @Field((type) => MasterItemCategoryInfo)
  categoryInfo: MasterItemCategoryInfo;

  @Column({ type:'int' })
  @Field((type) => Number)
  price: number;

  @Column({ type:'mediumint' })
  @Field((type) => Number)
  count: number;

  @Column({ length: 40, nullable: true })
  @Field((type) => String, { nullable: true })
  userCode?: string;

  @Column({ type: 'text', nullable: true })
  @Field((type) => String, { nullable: true })
  description?: string;

  @Column('simple-array', { nullable: true })
  @Field((type) => [String], { nullable: true })
  selectionInfo?: string[];

  @Column('simple-json', { nullable: true })
  @Field((type) => MasterItemAdditionalInfo, { nullable: true })
  additionalInfo?: MasterItemAdditionalInfo;

  @Column('simple-json', { nullable: true })
  @Field((type) => MasterItemSellingItemInfo, { nullable: true })
  sellingItemInfo?: MasterItemSellingItemInfo;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt?: Date;

  @CreateDateColumn()
  @Field((type) => Date)
  updatedAt?: Date;

  // relation entities

  @OneToMany(() => MasterItemSelection, (selection) => selection.masterItem)
  @Field((type) => [MasterItemSelection], { nullable: true })
  selectionInfoList?: MasterItemSelection[];

  @OneToMany(() => MasterItemAddoption, (addOption) => addOption.masterItem)
  @Field((type) => [MasterItemAddoption], { nullable: true })
  addOptionInfoList?: MasterItemAddoption[];

  @OneToMany(() => MasterItemExtend, (ext) => ext.masterItem)
  @Field((type) => [MasterItemExtend], { nullable: true })
  extendInfoList?: MasterItemExtend[];
}

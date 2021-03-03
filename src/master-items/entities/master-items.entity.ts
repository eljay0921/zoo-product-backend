import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MasterItemExtend } from 'src/master-items/entities/master-items-extend.entity';
import { AdditionalInfo } from '../json-entities/master-items-additionalInfo.entity';

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
  @Field((type) => String)
  categoryInfo: string;

  @Column()
  @Field((type) => Number)
  price: number;

  @Column()
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
  @Field((type) => AdditionalInfo, { nullable: true })
  additionalInfo?: AdditionalInfo;

  @Column('simple-json', { nullable: true })
  @Field((type) => String, { nullable: true })
  sellingItemInfo?: string;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt?: Date;

  @CreateDateColumn()
  @Field((type) => Date)
  updatedAt?: Date;

  @OneToMany(() => MasterItemExtend, (ext) => ext.masterItem)
  @Field((type) => [MasterItemExtend], { nullable: true })
  extendInfoList?: MasterItemExtend[];
}

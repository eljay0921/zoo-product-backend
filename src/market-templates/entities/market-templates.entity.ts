import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
@ObjectType()
// @Entity()
export class MarketTemplates {
  // @PrimaryGeneratedColumn()
  @Field(() => Number)
  id?: number;

  // @Column({ length: 1 })
  @Field(() => String)
  marketCode: string;

  // @Column({ length: 4 })
  @Field(() => String)
  marketSubCode: string;

  // @Column()
  @Field(() => Number)
  smid: number;

  // @Column({ length: 40 })
  @Field(() => String)
  marketID: string;

  // @Column({ length: 100 })
  @Field(() => String)
  name: string;

  // @Column({ length: 100 })
  @Field(() => String)
  description: string;

  // TODO : JSON 타입으로 변경 => 구조는 상관 CSetInfoBase 참고
  // @Column('simple-json')
  @Field(() => String)
  baseInfo: string;

  // @Column('simple-json', { nullable: true })
  @Field(() => String, { nullable: true })
  basicExtendInfo?: string;

  // @Column('simple-json', { nullable: true })
  @Field(() => String, { nullable: true })
  extendInfo?: string;

  // @Column('simple-json', { nullable: true })
  @Field(() => String, { nullable: true })
  deliveryInfo?: string;

  // @Column('simple-json', { nullable: true })
  @Field(() => String, { nullable: true })
  addServiceInfo?: string;

  // @Column('simple-json', { nullable: true })
  @Field(() => String, { nullable: true })
  etcInfo?: string;

  // @CreateDateColumn()
  @Field(() => Date)
  createdAt?: Date;

  // @CreateDateColumn()
  @Field(() => Date)
  updatedAt?: Date;
}

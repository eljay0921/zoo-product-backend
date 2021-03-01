import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MasterItem {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @PrimaryColumn({ type: 'varchar', length: 20 })
  @Field((type) => String)
  userId: string;

  @Column({ length: 300 })
  @Field((type) => String)
  name: string;

  @Column({ length: 10 })
  @Field((type) => String)
  categoryCode: string;

  @Column({ type: 'simple-json' })
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

  @Column({ type: 'simple-json', nullable: true })
  @Field((type) => String, { nullable: true })
  selectionInfo?: string;

  @Column({ type: 'simple-json', nullable: true })
  @Field((type) => String, { nullable: true })
  additionalInfo?: string;

  @Column({ type: 'simple-json', nullable: true })
  @Field((type) => String, { nullable: true })
  sellingItemInfo?: string;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;

  @CreateDateColumn()
  @Field((type) => Date)
  updatedAt: Date;
}

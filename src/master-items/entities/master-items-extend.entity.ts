import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MasterItemExtend {
  @PrimaryColumn({ type: 'int' })
  @Field((type) => Number)
  masterItemId: number;

  @PrimaryColumn({ type: 'char', length: 1 })
  @Field((type) => String)
  marketCode: string;

  @PrimaryColumn({ type: 'char', length: 4 })
  @Field((type) => String)
  marketSubCode: string;

  @Column({ type: 'simple-json' })
  @Field((type) => String)
  info: string;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;
}

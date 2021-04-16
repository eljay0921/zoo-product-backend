import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MasterItem } from './master-items.entity';

@InputType({ isAbstract: true })
@ObjectType()
// @Entity('master_addoption')
export class MasterItemAddoption {
  // @ManyToOne(() => MasterItem, (master) => master.addOptionInfoList, {
    // primary: true,
    // onDelete: 'CASCADE',
  // })
  @Field(() => MasterItem)
  masterItem?: MasterItem;

  // @PrimaryColumn({ type: 'smallint' })
  @Field(() => Number)
  order: number;
  
  // @Column({ length: 100 })
  @Field(() => String)
  name: string;

  // @Column({ length: 100 })
  @Field(() => String)
  value: string;

  // @Column()
  @Field(() => Number)
  count: number;

  // @Column()
  @Field(() => Number)
  price: number;

  // @CreateDateColumn()
  @Field(() => Date)
  createdAt?: Date;
}

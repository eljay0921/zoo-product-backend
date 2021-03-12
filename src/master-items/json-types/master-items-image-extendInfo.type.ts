import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
@ObjectType()
export class MasterItemImageExtendInfo {
  @Field(() => String, { nullable: true })
  altMessage?: string;
}

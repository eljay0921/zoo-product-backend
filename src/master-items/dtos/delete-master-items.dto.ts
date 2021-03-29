import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteMasterItemsInput {
  @Field(() => [Number])
  ids: number[];
}

@ObjectType()
export class DeleteMasterItemResult {
  @Field(() => Number)
  id: number;

  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class DeleteMasterItemsOutput extends CoreOutput {
  @Field(() => [DeleteMasterItemResult], { nullable: true })
  results?: DeleteMasterItemResult[];
}

import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { eSexType } from '../common.enum.types';

registerEnumType(eSexType, { name: 'eSexType' });

@InputType()
export class StudentInput {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  age: number;

  @Field(() => eSexType)
  sex: eSexType;
}

@ObjectType()
export class StudentOutputBase {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  age: number;

  @Field(() => eSexType)
  sex: eSexType;
}

@ObjectType()
export class StudentOutput extends CoreOutput {
  @Field(() => [StudentOutputBase])
  students?: StudentOutputBase[];
}

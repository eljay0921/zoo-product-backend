import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field((type) => String, { nullable: true })
  error?: string;

  @Field((type) => Boolean)
  ok: boolean;
}

export class DBOutput extends CoreOutput {
  result?: any;
}

export class CommonOutput extends CoreOutput {
  message?: string;
}

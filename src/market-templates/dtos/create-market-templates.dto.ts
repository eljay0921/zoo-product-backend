import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MarketTemplates } from '../entities/market-templates.entity';

@InputType()
export class MarketTemplatesInput extends OmitType(MarketTemplates, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

@ObjectType()
export class MarketTemplatesOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  resultTemplateId?: number;
}

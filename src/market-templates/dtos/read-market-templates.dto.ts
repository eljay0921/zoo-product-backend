import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MarketTemplates } from '../entities/market-templates.entity';

@ObjectType()
export class ReadMarketTemplatesOutput extends CoreOutput {
  @Field((type) => Number, { nullable: true })
  count?: number = 0;

  @Field((type) => [MarketTemplates], { nullable: true })
  marketTemplates?: MarketTemplates[];
}

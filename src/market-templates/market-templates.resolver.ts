import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  MarketTemplatesInput,
  MarketTemplatesOutput,
} from './dtos/create-market-templates.dto';
import { ReadMarketTemplatesOutput } from './dtos/read-market-templates.dto';
import { MarketTemplates } from './entities/market-templates.entity';
import { MarketTemplatesService } from './market-templates.service';

@Resolver((of) => MarketTemplates)
export class MarketTemplatesResolver {
  constructor(
    private readonly marketTemplatesService: MarketTemplatesService,
  ) {}

  @Query(() => ReadMarketTemplatesOutput)
  async getMarketTemplates(
    @Args('id', { nullable: true }) templateId?: number,
    @Args('marketCode', { nullable: true }) marketCode?: string,
    @Args('marketSubCode', { nullable: true }) marketSubCode?: string,
  ): Promise<ReadMarketTemplatesOutput> {
    return this.marketTemplatesService.getMarketTemplates(
      templateId,
      marketCode,
      marketSubCode,
    );
  }

  @Mutation(() => MarketTemplatesOutput)
  async createMarketTemplates(
    @Args('input') createMarketTemplatesInput: MarketTemplatesInput,
  ): Promise<MarketTemplatesOutput> {
    return this.marketTemplatesService.insertMarketTemplates(
      createMarketTemplatesInput,
    );
  }
}

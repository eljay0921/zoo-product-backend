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
  async getMarketTemplate(
    @Args('id') templateId: number,
  ): Promise<ReadMarketTemplatesOutput> {
    return this.marketTemplatesService.getMarketTemplate(templateId);
  }

  @Query(() => ReadMarketTemplatesOutput)
  async getMarketTemplates(
    @Args('marketCode') marketCode: string,
    @Args('marketSubCode') marketSubCode: string,
  ): Promise<ReadMarketTemplatesOutput> {
    return this.marketTemplatesService.getMarketTemplates(
      marketCode,
      marketSubCode,
    );
  }

  @Mutation(() => MarketTemplatesOutput)
  async createMarketTemplate(
    @Args('input') createMarketTemplatesInput: MarketTemplatesInput,
  ): Promise<MarketTemplatesOutput> {
    return this.marketTemplatesService.insertMarketTemplate(
      createMarketTemplatesInput,
    );
  }
}

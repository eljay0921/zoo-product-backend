import { Args, Query, Resolver } from "@nestjs/graphql";
import { ReadMarketTemplatesOutput } from "./dtos/read-market-templates.dto";
import { MarketTemplates } from "./entities/market-templates.entity";
import { MarketTemplatesService } from "./market-templates.service";

@Resolver(of => MarketTemplates)
export class MarketTemplatesResolver {

    constructor(private readonly marketTemplatesService: MarketTemplatesService) {}

    @Query(() => ReadMarketTemplatesOutput)
    async getMarketTemplates(
        @Args('id') templateId:number, 
        @Args('marketCode') marketCode:string, 
        @Args('marketCode') marketSubCode:string ): Promise<ReadMarketTemplatesOutput> {
            return this.marketTemplatesService.getMarketTemplates(templateId, marketCode, marketSubCode);
    }
}
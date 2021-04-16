import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  CreateMarketTemplatesInput,
  CreateMarketTemplatesOutput,
} from './dtos/create-market-templates.dto';
import { ReadMarketTemplatesOutput } from './dtos/read-market-templates.dto';

@Injectable()
export class MarketTemplatesService {
  // constructor(
  //   @InjectRepository(MarketTemplates)
  //   private readonly marketTemplatesRepo: Repository<MarketTemplates>,
  // ) {}

  // private readonly marketTemplatesRepo: Repository<MarketTemplates>;
  constructor(@Inject(REQUEST) private readonly request) {
    // this.marketTemplatesRepo = getManager(
    //   this.request.req.dbname,
    // ).getRepository(MarketTemplates);
  }

  async getMarketTemplate(
    templateId: number,
  ): Promise<ReadMarketTemplatesOutput> {
    try {

        return {
          ok: false,
          count: 0,
        };

    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async getMarketTemplates(
    marketCode: string,
    marketSubCode: string,
  ): Promise<ReadMarketTemplatesOutput> {
    try {

        return {
          ok: false,
          count: 0,
        };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async insertMarketTemplate(
    marketTemplatesInput: CreateMarketTemplatesInput,
  ): Promise<CreateMarketTemplatesOutput> {
    try {

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }
}

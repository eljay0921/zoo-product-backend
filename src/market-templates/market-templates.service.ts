import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getManager, Repository } from 'typeorm';
import {
  CreateMarketTemplatesInput,
  CreateMarketTemplatesOutput,
} from './dtos/create-market-templates.dto';
import { ReadMarketTemplatesOutput } from './dtos/read-market-templates.dto';
import { MarketTemplates } from './entities/market-templates.entity';

@Injectable()
export class MarketTemplatesService {
  // constructor(
  //   @InjectRepository(MarketTemplates)
  //   private readonly marketTemplatesRepo: Repository<MarketTemplates>,
  // ) {}

  private readonly marketTemplatesRepo: Repository<MarketTemplates>;
  constructor(@Inject(REQUEST) private readonly request) {
    this.marketTemplatesRepo = getManager(
      this.request.req.dbname,
    ).getRepository(MarketTemplates);
  }

  async getMarketTemplate(
    templateId: number,
  ): Promise<ReadMarketTemplatesOutput> {
    try {
      const marketTemplate = await this.marketTemplatesRepo.findOne({
        id: templateId,
      });

      if (marketTemplate) {
        return {
          ok: true,
          count: 1,
          marketTemplates: [marketTemplate],
        };
      } else {
        return {
          ok: false,
          count: 0,
        };
      }
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
      const marketTemplates = await this.marketTemplatesRepo.find({
        marketCode,
        marketSubCode,
      });

      if (marketTemplates) {
        return {
          ok: true,
          count: marketTemplates.length,
          marketTemplates,
        };
      } else {
        return {
          ok: false,
          count: 0,
        };
      }
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
      const result = await this.marketTemplatesRepo.save(
        this.marketTemplatesRepo.create(marketTemplatesInput),
      );
      return {
        ok: true,
        resultTemplateId: result.id,
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

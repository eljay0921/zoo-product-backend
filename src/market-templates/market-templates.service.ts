import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MarketTemplatesInput,
  MarketTemplatesOutput,
} from './dtos/create-market-templates.dto';
import { ReadMarketTemplatesOutput } from './dtos/read-market-templates.dto';
import { MarketTemplates } from './entities/market-templates.entity';

@Injectable()
export class MarketTemplatesService {
  constructor(
    @InjectRepository(MarketTemplates)
    private readonly marketTemplatesRepo: Repository<MarketTemplates>,
  ) {}

  async getMarketTemplates(
    templateId?: number,
    marketCode?: string,
    marketSubCode?: string,
  ): Promise<ReadMarketTemplatesOutput> {
    try {
      if (templateId) {
        const marketTemplates = await this.marketTemplatesRepo.find({
          id: templateId,
        });
        return {
          ok: true,
          marketTemplates,
        };
      }

      if (marketCode && marketSubCode) {
        const marketTemplates = await this.marketTemplatesRepo.find({
          marketCode,
          marketSubCode,
        });
        return {
          ok: true,
          marketTemplates,
        };
      }

      return {
        ok: false,
        error: '올바르지 않은 요청입니다.',
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async insertMarketTemplates(
    marketTemplatesInput: MarketTemplatesInput,
  ): Promise<MarketTemplatesOutput> {
    try {
      const result = await this.marketTemplatesRepo.save(
        this.marketTemplatesRepo.create(marketTemplatesInput),
      );
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

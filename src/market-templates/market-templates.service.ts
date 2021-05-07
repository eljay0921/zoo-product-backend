import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { getManager, Repository } from 'typeorm';
import { MarketTemplates } from './entities/market-templates.entity';

@Injectable()
export class MarketTemplatesService {

  private readonly marketTemplatesRepo: Repository<MarketTemplates>;
  constructor(@Inject(REQUEST) private readonly request) {
    this.marketTemplatesRepo = getManager(
      this.request.dbname,
    ).getRepository(MarketTemplates);
  }

  async getMarketTemplate(
    templateId: number,
  ): Promise<CommonOutput> {
    try {

      const marketTemplate = await this.marketTemplatesRepo.findOne({
        id: templateId,
      });

      if (marketTemplate) {
        return {
          ok: true,
          data: marketTemplate,
        };
      } else {
        return {
          ok: false
        };
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getMarketTemplates(
    marketCode: string,
    marketSubCode?: string,
  ): Promise<CommonOutput> {
    try {

      let marketTemplates;
      if(marketSubCode) {
        marketTemplates = await this.marketTemplatesRepo.find({marketCode, marketSubCode});
      } else {
        marketTemplates = await this.marketTemplatesRepo.find({marketCode});
      }

      if (marketTemplates) {
        return {
          ok: true,
          count: marketTemplates.length,
          data: marketTemplates,
        };
      } else {
        return {
          ok: false
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
    marketTemplatesInput: MarketTemplates,
  ): Promise<CommonOutput> {
    try {
      const result = await this.marketTemplatesRepo.insert(
        this.marketTemplatesRepo.create(marketTemplatesInput),
      );
      return {
        ok: true,
        data:{
          templateId: result.raw.insertId,
        }
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

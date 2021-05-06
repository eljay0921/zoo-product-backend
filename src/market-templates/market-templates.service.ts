import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { sendQuery } from 'src/common/database/connection/mariadb.adapter';
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
    // this.marketTemplatesRepo = getManager(
    //   this.request.req.dbname,
    // ).getRepository(MarketTemplates);
  }

  async selectMarketTemplate(id: number): Promise<any> {
    const query = `SELECT 
      *
    FROM ProductManage_admin.market_templates
    WHERE id = ${id}`;

    return await sendQuery(query);
  }

  async selectMarketTemplateList(
    marketCode: string,
    marketSubCode: string,
  ): Promise<any> {
    const query = `SELECT 
      *
    FROM ProductManage_admin.market_templates
    WHERE marketCode = '${marketCode}'
    and marketSubCode = '${marketSubCode}'`;

    return await sendQuery(query);
  }

  async insertMarketTemplate2(marketTemplate: MarketTemplates): Promise<any> {
    const query = `INSERT INTO ProductManage_admin.market_templates
    (marketCode, marketSubCode, smid, marketID, name, description, baseInfo, basicExtendInfo, extendInfo, deliveryInfo, addServiceInfo, etcInfo, createdAt, updatedAt)
    VALUES('${marketTemplate.marketCode}', 
    '${marketTemplate.marketSubCode}', 
    ${marketTemplate.smid}, 
    '${marketTemplate.marketID}', 
    '${marketTemplate.name}', 
    '${marketTemplate.description}', 
    ${marketTemplate.baseInfo}, 
    ${marketTemplate.basicExtendInfo}, 
    ${marketTemplate.extendInfo}, 
    ${marketTemplate.deliveryInfo}, 
    ${marketTemplate.addServiceInfo}, 
    ${marketTemplate.etcInfo}, 
    current_timestamp(6), current_timestamp(6));`;

    return await sendQuery(query);
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

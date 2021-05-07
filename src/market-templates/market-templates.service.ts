import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { sendQuery } from 'src/common/database/connection/mariadb.adapter';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { CreateMarketTemplate } from './entities/market-templates.entity';

@Injectable()
export class MarketTemplatesService {
  private readonly DBName: string;
  constructor(@Inject(REQUEST) private readonly request) {
    this.DBName = this.request?.dbname;
  }

  async selectMarketTemplate(id: number): Promise<CommonOutput> {
    const query = `SELECT 
      *
    FROM ${this.DBName}.market_templates
    WHERE id = ${id}`;

    const { ok, error, result } = await sendQuery(query);
    return {
      ok,
      error,
      data: result,
    }
  }

  async selectMarketTemplateList(
    marketCode: string,
    marketSubCode: string,
  ): Promise<CommonOutput> {
    const query = `SELECT 
      *
    FROM ${this.DBName}.market_templates
    WHERE marketCode = '${marketCode}'
    and marketSubCode = '${marketSubCode}'`;

    const { ok, error, result } = await sendQuery(query);
    return {
      ok,
      error,
      count: result.length,
      data: result,
    }
  }

  async insertMarketTemplate(marketTemplate: CreateMarketTemplate): Promise<CommonOutput> {
    const query = `INSERT INTO ${this.DBName}.market_templates
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

    const { ok, error, result } = await sendQuery(query);
    return {
      ok,
      error,
      data: {
        templateId: result.insertId
      },
    }
  }
}

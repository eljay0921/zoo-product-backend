import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { sendQuery } from 'src/common/database/connection/mariadb.adapter';
import { MarketTemplates } from './entities/market-templates.entity';

@Injectable()
export class MarketTemplatesService {
  private readonly DBName: string;
  constructor(@Inject(REQUEST) private readonly request) {
    this.DBName = this.request?.dbname;
  }

  async selectMarketTemplate(id: number): Promise<any> {
    const query = `SELECT 
      *
    FROM ${this.DBName}.market_templates
    WHERE id = ${id}`;

    return await sendQuery(query);
  }

  async selectMarketTemplateList(
    marketCode: string,
    marketSubCode: string,
  ): Promise<any> {
    const query = `SELECT 
      *
    FROM ${this.DBName}.market_templates
    WHERE marketCode = '${marketCode}'
    and marketSubCode = '${marketSubCode}'`;

    return await sendQuery(query);
  }

  async insertMarketTemplate2(marketTemplate: MarketTemplates): Promise<any> {
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

    return await sendQuery(query);
  }
}

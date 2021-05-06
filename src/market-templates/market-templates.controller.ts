import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DatabaseGuard } from 'src/common/guards/database.guard';
import { MarketTemplates } from './entities/market-templates.entity';
import { MarketTemplatesService } from './market-templates.service';

@UseGuards(DatabaseGuard)
@Controller('market-templates')
export class MarketTemplatesController {
  constructor(private readonly service: MarketTemplatesService) {}

  @Get('list')
  async getMarketTemplateList(
    @Query('marketCode') marketCode: string,
    @Query('marketSubCode') marketSubCode: string,
  ): Promise<any> {
    return this.service.selectMarketTemplateList(marketCode, marketSubCode);
  }

  @Get(':id')
  async getMarketTemplate(@Param('id') id: number): Promise<any> {
    return this.service.selectMarketTemplate(id);
  }

  @Post()
  async createMarketTemplate(
    @Body() createMarketTemplateDto: MarketTemplates,
  ): Promise<any> {
    return this.service.insertMarketTemplate2(createMarketTemplateDto);
  }
}

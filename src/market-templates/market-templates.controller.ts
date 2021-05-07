import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { DatabaseGuard } from 'src/common/guards/database.guard';
import { CreateMarketTemplate } from './entities/market-templates.entity';
import { MarketTemplatesService } from './market-templates.service';

@UseGuards(DatabaseGuard)
@Controller('market-templates')
export class MarketTemplatesController {
  constructor(private readonly service: MarketTemplatesService) {}

  @Get('list')
  async getMarketTemplateList(
    @Query('marketCode') marketCode: string,
    @Query('marketSubCode') marketSubCode: string,
  ): Promise<CommonOutput> {
    return this.service.selectMarketTemplateList(marketCode, marketSubCode);
  }

  @Get(':id')
  async getMarketTemplate(@Param('id') id: number): Promise<CommonOutput> {
    return this.service.selectMarketTemplate(id);
  }

  @Post()
  async createMarketTemplate(
    @Body() createMarketTemplateDto: CreateMarketTemplate,
  ): Promise<CommonOutput> {
    return this.service.insertMarketTemplate(createMarketTemplateDto);
  }
}

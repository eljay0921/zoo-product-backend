import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { DatabaseGuard } from 'src/common/guards/database.guard';
import { MarketTemplates } from './entities/market-templates.entity';
// import { CreateMarketTemplate } from './entities/market-templates.entity';
import { MarketTemplatesService } from './market-templates.service';

@UseGuards(DatabaseGuard)
@Controller('market-templates')
export class MarketTemplatesController {
  constructor(private readonly service: MarketTemplatesService) {}

  @Get()
  async getMarketTemplateList(
    @Query('marketCode') marketCode: string,
    @Query('marketSubCode') marketSubCode?: string,
  ): Promise<CommonOutput> {
    return this.service.getMarketTemplates(marketCode, marketSubCode);
  }

  @Get(':id')
  async getMarketTemplate(@Param('id') id: number): Promise<CommonOutput> {
    return this.service.getMarketTemplate(id);
  }

  @Post()
  async createMarketTemplate(
    @Body() createMarketTemplateDto: MarketTemplates,
  ): Promise<CommonOutput> {
    return this.service.insertMarketTemplate(createMarketTemplateDto);
  }

  @Delete(':id')
  async deleteMarketTemplate(@Param('id') id: number): Promise<CommonOutput> {
    return this.service.deleteMarketTemplate(id);
  }
}

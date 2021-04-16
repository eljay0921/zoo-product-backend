import { Module } from '@nestjs/common';
import { MarketTemplatesResolver } from './market-templates.resolver';
import { MarketTemplatesService } from './market-templates.service';

@Module({
  imports: [
    // TypeOrmModule.forFeature([MarketTemplates])
  ],
  providers: [MarketTemplatesResolver, MarketTemplatesService],
})
export class MarketTemplatesModule {}
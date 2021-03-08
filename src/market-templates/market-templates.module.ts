import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketTemplates } from './entities/market-templates.entity';
import { MarketTemplatesResolver } from './market-templates.resolver';
import { MarketTemplatesService } from './market-templates.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([MarketTemplates])
    ],
    providers: [MarketTemplatesResolver, MarketTemplatesService],
})
export class MarketTemplatesModule {}

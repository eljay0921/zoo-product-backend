import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketTemplates } from './entities/market-templates.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MarketTemplates])
    ],
    providers: [],
})
export class MarketTemplatesModule {}

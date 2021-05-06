import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketTemplates } from './entities/market-templates.entity';
import { MarketTemplatesResolver } from './market-templates.resolver';
import { MarketTemplatesService } from './market-templates.service';
import { MarketTemplatesController } from './market-templates.controller';
import { DatabaseMiddleware } from 'src/common/middlewares/database.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([MarketTemplates])],
  providers: [MarketTemplatesResolver, MarketTemplatesService],
  controllers: [MarketTemplatesController],
})
export class MarketTemplatesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DatabaseMiddleware).forRoutes(
      { path: '/', method: RequestMethod.ALL },
      // { path: 'market-templates', method: RequestMethod.ALL },
    );
  }
}

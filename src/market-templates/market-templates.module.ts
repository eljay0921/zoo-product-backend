import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MarketTemplatesService } from './market-templates.service';
import { MarketTemplatesController } from './market-templates.controller';
import { DatabaseMiddleware } from 'src/common/middlewares/database.middleware';

@Module({
  imports: [],
  providers: [MarketTemplatesService],
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

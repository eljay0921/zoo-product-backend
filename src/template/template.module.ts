import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { DatabaseMiddleware } from 'src/common/middlewares/database.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  providers: [TemplateService],
  controllers: [TemplateController],
})
export class TemplateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DatabaseMiddleware).forRoutes(
      { path: '/', method: RequestMethod.ALL },
    );
  }
}

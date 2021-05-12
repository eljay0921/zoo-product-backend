import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ItemModule } from './item/item.module';
import { TemplateModule } from './template/template.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomNamingStrategy } from './common/typeorm/custom-naming-strategy';
import {
  DB_HOST,
  DB_PORT,
  DB_PSWD,
  DB_USER,
} from './common/database/constants/mariadb.constants';
import { FolderModule } from './folder/folder.module';
import { DatabaseMiddleware } from './common/middlewares/database.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USER,
      password: DB_PSWD,
      database: 'ProductManage_admin',
      synchronize: true,
      logging: false,
      namingStrategy: new CustomNamingStrategy(),
      entities: [
        'dist/**/entities/*.entity{.ts,.js}',
        'src/**/entities/*.entity{.ts}',
      ],
    }),
    ItemModule,
    CommonModule,
    TemplateModule,
    FolderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DatabaseMiddleware).forRoutes(
      { path: '/item', method: RequestMethod.ALL },
      { path: '/folder', method: RequestMethod.ALL },
      { path: '/template', method: RequestMethod.ALL },
    );
  }
}

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CommonModule } from './common/common.module';
import { MasterItemsModule } from './master-items/master-items.module';
import { MarketTemplatesModule } from './market-templates/market-templates.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterItem } from './master-items/entities/master-items.entity';
import { MasterItemExtend } from './master-items/entities/master-items-extend.entity';
import { MasterItemSelectionDetail } from './master-items/entities/master-items-selection-detail.entity';
import { MasterItemAddoption } from './master-items/entities/master-items-addoption.entity';
import { MarketTemplates } from './market-templates/entities/market-templates.entity';
import { MasterItemImage } from './master-items/entities/master-items-image.entity';
import { MasterItemSelectionBase } from './master-items/entities/master-items-selection-base.entity';
import { CustomNamingStrategy } from './common/typeorm/custom-naming-strategy';
import {
  DB_HOST,
  DB_PORT,
  DB_PSWD,
  DB_USER,
} from './common/database/constants/mariadb.constants';
import { DatabaseMiddleware } from './common/middlewares/database.middleware';
import { UserFolderModule } from './user-folder/user-folder.module';

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
      logging: true,
      namingStrategy: new CustomNamingStrategy(),
      entities: [
        'dist/**/entities/*.entity{.ts,.js}',
        'src/**/entities/*.entity{.ts}',
      ],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    MasterItemsModule,
    CommonModule,
    MarketTemplatesModule,
    UserFolderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DatabaseMiddleware).forRoutes(
      { path: 'graphql', method: RequestMethod.ALL },
      // { path: 'market-templates', method: RequestMethod.ALL },
    );
  }
}

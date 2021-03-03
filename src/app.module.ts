import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { MasterItemsModule } from './master-items/master-items.module';
import { MasterItem } from './master-items/entities/master-items.entity';
import { MasterItemExtend } from './master-items/entities/master-items-extend.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Photo } from './user/entities/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3310,
      username: 'root',
      password: 'mmaria',
      database: 'ProductManage',
      synchronize: true,
      logging: true,
      entities: [MasterItem, MasterItemExtend, User, Photo]
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    MasterItemsModule,
    CommonModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

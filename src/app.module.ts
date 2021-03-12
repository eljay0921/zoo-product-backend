import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { MasterItemsModule } from './master-items/master-items.module';
import { MasterItem } from './master-items/entities/master-items.entity';
import { MasterItemExtend } from './master-items/entities/master-items-extend.entity';
import { MasterItemSelectionDetail } from './master-items/entities/master-items-selection-detail.entity';
import { MasterItemAddoption } from './master-items/entities/master-items-addoption.entity';
import { MarketTemplatesModule } from './market-templates/market-templates.module';
import { MarketTemplates } from './market-templates/entities/market-templates.entity';
import { MasterItemImage } from './master-items/entities/master-items-image.entity';
import { MasterItemSelectionBase } from './master-items/entities/master-items-selection-base.entity';
import { TestUsersModule } from './test-users/test-users.module';
import { Lesson } from './test-users/typeorm-entities/class.entity';
import { Student } from './test-users/typeorm-entities/student.entity';
import { ClassStudentMap } from './test-users/typeorm-entities/class-student-map.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mmaria',
      database: 'ProductManage',
      synchronize: true,
      logging: true,
      entities: [
        MasterItem,
        MasterItemExtend,
        MasterItemImage,
        MasterItemSelectionBase,
        MasterItemSelectionDetail,
        MasterItemAddoption,
        MarketTemplates,
        Student,
        Lesson,
        ClassStudentMap,
      ],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    MasterItemsModule,
    CommonModule,
    MarketTemplatesModule,
    TestUsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

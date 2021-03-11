import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterItemAddoption } from './entities/master-items-addoption.entity';
import { MasterItemExtend } from './entities/master-items-extend.entity';
import { MasterItemImage } from './entities/master-items-image.entity';
import { MasterItemSelectionBase } from './entities/master-items-selection-base.entity';
import { MasterItemSelectionDetail } from './entities/master-items-selection-detail.entity';
import { MasterItem } from './entities/master-items.entity';
import { MasterItemsResolver } from './master-items.resolver';
import { MasterItemsService } from './master-items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MasterItem,
      MasterItemExtend,
      MasterItemImage,
      MasterItemSelectionBase,
      MasterItemSelectionDetail,
      MasterItemAddoption,
    ]),
  ],
  providers: [MasterItemsResolver, MasterItemsService],
})
export class MasterItemsModule {}

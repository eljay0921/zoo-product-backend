import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterItemAddoption } from './entities/master-items-addoption.entity';
import { MasterItemExtend } from './entities/master-items-extend.entity';
import { MasterItemImage } from './entities/master-items-image.entity';
import { MasterItemSelection } from './entities/master-items-selection.entity';
import { MasterItem } from './entities/master-items.entity';
import { MasterItemsResolver } from './master-items.resolver';
import { MasterItemsService } from './master-items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MasterItem,
      MasterItemExtend,
      MasterItemImage,
      MasterItemSelection,
      MasterItemAddoption,
    ]),
  ],
  providers: [MasterItemsResolver, MasterItemsService],
})
export class MasterItemsModule {}

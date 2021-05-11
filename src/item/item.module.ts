import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addoption } from './entities/item-addoption.entity';
import { Extend } from './entities/item-extend.entity';
import { Image } from './entities/item-image.entity';
import { Selection } from './entities/item-selection.entity';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { SelectionDetail } from './entities/item-selection-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Item,
      Extend,
      Image,
      Selection,
      SelectionDetail,
      Addoption,
    ]),
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}

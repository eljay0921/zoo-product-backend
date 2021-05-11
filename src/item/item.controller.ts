import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Get('list-simple')
  async getMasterItemsQuick(
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<CommonOutput> {
    return this.service.getMasterItemListNoRelations(page, size);
  }

  @Get('list')
  async getMasterItems(@Body() body): Promise<CommonOutput> {
    return this.service.getMasterItemListWithRelations(body.data);
  }

  @Get(':id')
  async getMasterItem(@Param('id') id: number): Promise<CommonOutput> {
    return this.service.getOneMasterItemWithRelations(id);
  }

  @Post()
  async createMasterItems(
    @Query('mode') mode: string,
    @Body() body: Item[],
  ): Promise<CommonOutput> {
    if (mode) {
      const masterItems = body;
      if (mode == 'normal') {
        return this.service.insertItems(masterItems);
      }

      if (mode == 'bulk') {
        return this.service.insertItemsBulk(masterItems);
      }
    }
    return {
      ok: false,
      message: 'Not supported mode.',
    };
  }

  @Delete()
  async deleteMasterItems(@Body() body): Promise<CommonOutput> {
    return this.service.deleteItems(body.data);
  }
}

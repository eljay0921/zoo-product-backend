import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { MasterItem } from './entities/master-items.entity';
import { MasterItemsService } from './master-items.service';

@Controller('master-items')
export class MasterItemsController {
  constructor(private readonly service: MasterItemsService) {}

  @Get(':id')
  async getMasterItem(@Param('id') id:number): Promise<CommonOutput> {
    return this.service.getMasterItemWithRelations(id);
  }

  @Get('list')
  async getMasterItems(@Body() body): Promise<CommonOutput> {
    return this.service.getMasterItemsWithRelations(
        body.ids,
    );
  }

  @Get('list-simple')
  async getMasterItemsQuick(@Query('page') page: number, @Query('size') size: number): Promise<CommonOutput> {
    return this.service.getMasterItemsNoRelations(page, size);
  }

  @Post()
  async createMasterItems(@Body() body: MasterItem[]): Promise<CommonOutput> {
    const masterItems = body;
    return this.service.insertItems(masterItems);
  }

//   @Mutation(() => CreateMasterItemsOutput)
//   async createMasterItemsBulk(
//     @Args('input') createMasterItemsInput: CreateMasterItemsInput,
//     @Context() ctx,
//   ): Promise<CreateMasterItemsOutput> {
//     console.log('Resolver : ', ctx.req.dbname);
//     return this.masterItemsService.insertItemsBulk(createMasterItemsInput);
//   }

//   @Mutation(() => DeleteMasterItemsOutput)
//   async deleteMasterItems(
//     @Args('input') deleteMasterItemsInput: DeleteMasterItemsInput,
//   ): Promise<DeleteMasterItemsOutput> {
//     return this.masterItemsService.deleteItems(deleteMasterItemsInput);
//   }
}

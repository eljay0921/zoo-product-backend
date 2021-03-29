import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateMasterItemsInput,
  CreateMasterItemsOutput,
} from './dtos/create-master-items.dto';
import { DeleteMasterItemsInput, DeleteMasterItemsOutput } from './dtos/delete-master-items.dto';
import { ReadMasterItemsOutput } from './dtos/read-master-items.dto';
import { MasterItem } from './entities/master-items.entity';
import { MasterItemsService } from './master-items.service';

@Resolver((of) => MasterItem)
export class MasterItemsResolver {
  constructor(private readonly masterItemsService: MasterItemsService) {}

  @Query(() => String)
  HelloWorld() {
    return 'Hi, this is new product-manage back-end.';
  }

  @Query(() => ReadMasterItemsOutput)
  async getMasterItem(@Args('id') id: number): Promise<ReadMasterItemsOutput> {
    return this.masterItemsService.getMasterItem(id);
  }

  @Query(() => ReadMasterItemsOutput)
  async getMasterItems(
    @Args('page') page: number,
    @Args('size') size: number,
  ): Promise<ReadMasterItemsOutput> {
    return this.masterItemsService.getMasterItems(page, size);
  }

  @Mutation(() => CreateMasterItemsOutput)
  async createMasterItems(
    @Args('input') createMasterItemsInput: CreateMasterItemsInput,
  ): Promise<CreateMasterItemsOutput> {
    return this.masterItemsService.insertItems(createMasterItemsInput);
  }

  @Mutation(() => CreateMasterItemsOutput)
  async createMasterItemsBulk(
    @Args('input') createMasterItemsInput: CreateMasterItemsInput,
    // @Context() ctx,
  ): Promise<CreateMasterItemsOutput> {
    // console.log('Resolver : ', ctx.req.dbname);
    return this.masterItemsService.insertItemsBulk(createMasterItemsInput);
  }

  @Mutation(() => DeleteMasterItemsOutput)
  async deleteMasterItems(
    @Args('input') deleteMasterItemsInput: DeleteMasterItemsInput,
  ): Promise<DeleteMasterItemsOutput> {
    return this.masterItemsService.deleteItems(deleteMasterItemsInput);
  }
}

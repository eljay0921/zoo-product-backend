import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMasterItemsInput, CreateMasterItemsOutput } from './dtos/create-master-items.dto';
import { ReadMasterItemsOutput } from './dtos/read-master-items.dto';
import { MasterItem } from './entities/master-items.entity';
import { MasterItemsService } from './master-items.service';

@Resolver(of => MasterItem)
export class MasterItemsResolver {

    constructor(private readonly masterItemsService: MasterItemsService) {}

    @Query(() => String)
    HelloWorld() {
        return "Hi, this is new product-manage back-end.";
    }

    @Query(() => ReadMasterItemsOutput)
    async getMasterItems(@Args('page') page:number, @Args('size') size:number) : Promise<ReadMasterItemsOutput> {
        return this.masterItemsService.getItems(page, size);
    }

    @Mutation(() => CreateMasterItemsOutput)
    async createMasterItems(@Args('input') createMasterItemsInput:CreateMasterItemsInput) : Promise<CreateMasterItemsOutput> {
        return this.masterItemsService.insertItems(createMasterItemsInput);
    }

}
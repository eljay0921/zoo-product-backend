import { Module } from '@nestjs/common';
import { MasterItemsResolver } from './master-items.resolver';
import { MasterItemsService } from './master-items.service';

@Module({
  imports: [],
  providers: [MasterItemsResolver, MasterItemsService],
})
export class MasterItemsModule {}

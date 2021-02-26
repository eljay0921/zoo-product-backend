import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterItemExtend } from './entities/master-items-extend.entity';
import { MasterItem } from './entities/master-items.entity';
import { MasterItemsResolver } from './master-items.resolver';
import { MasterItemsService } from './master-items.service';

@Module({
    imports: [TypeOrmModule.forFeature([MasterItem, MasterItemExtend])],
    providers: [MasterItemsResolver, MasterItemsService],
})
export class MasterItemsModule {}

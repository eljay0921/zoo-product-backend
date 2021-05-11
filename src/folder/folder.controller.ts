import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { Folder } from './entities/folder.entity';
import { FolderService } from './folder.service';

@Controller('folder')
export class FolderController {
    constructor(private readonly userFolderService: FolderService) {}

    @Get()
    async getUserFolders(): Promise<CommonOutput> {
        return this.userFolderService.getUserFolders();
    }

    @Post()
    async createUserFolder(@Body() createUserFolderInput: Folder): Promise<CommonOutput> {
        return this.userFolderService.createUserFolder(createUserFolderInput);
    }

    @Delete(':id')
    async deleteUserFolder(@Param('id') id: number): Promise<CommonOutput> {
        return this.userFolderService.deleteUserFolder(id);
    }

    // @Get('mapping')
    // async getUserFolderMasterItems()
}

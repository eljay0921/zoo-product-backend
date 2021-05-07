import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { UserFolder } from './entities/user-folder.entity';
import { UserFolderService } from './user-folder.service';

@Controller('user-folder')
export class UserFolderController {
    constructor(private readonly userFolderService: UserFolderService) {}

    @Get()
    async getUserFolders(): Promise<CommonOutput> {
        return this.userFolderService.getUserFolders();
    }

    @Post()
    async createUserFolder(@Body() createUserFolderInput: UserFolder): Promise<CommonOutput> {
        return this.userFolderService.createUserFolder(createUserFolderInput);
    }

    @Delete(':id')
    async deleteUserFolder(@Param('id') id: number): Promise<CommonOutput> {
        return this.userFolderService.deleteUserFolder(id);
    }

    // @Get('mapping')
    // async getUserFolderMasterItems()
}

import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {

    constructor(private readonly commonService:CommonService) {}

    @Get('token')
    async getTokenProcess(id: string, pw: string): Promise<boolean> {
        // 1. check user
        const result = await this.commonService.checkUser(id, pw);

        // 2. return signed token
        return true;
    }

    @Post('db')
    async createDatabaseProcess(@Req() req): Promise<boolean> {
        const id = req.headers['user-id'];
        return await this.commonService.createUserDatabase(id);
    }

    @Delete('db')
    async truncateDatabaseProcess(@Req() req): Promise<boolean> {
        const id = req.headers['user-id'];
        return await this.commonService.truncateUserDatabase(id);
    }
}
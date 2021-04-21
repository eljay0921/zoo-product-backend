import { Controller, Get } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {

    constructor(private readonly commonService:CommonService) {}

    @Get('token')
    async getTokenProcess(id: string, pw: string){
        // 1. check user
        const result = await this.commonService.checkUser(id, pw);

        // 2. return signed token
        return;
    }
}

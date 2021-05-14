import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonOutput } from './dtos/output.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('token')
  async getTokenProcess(id: string, pw: string): Promise<boolean> {
    // 1. check user
    const result = await this.commonService.checkUser(id, pw);

    // 2. return signed token
    return true;
  }

  @Get('db')
  async getDatabaseExistCheck(@Req() req): Promise<CommonOutput> {
    const id = req.headers['user-id'];
    return this.commonService.checkUserDatabase(id);
  }

  @Post('db')
  async createDatabaseProcess(@Req() req): Promise<CommonOutput> {
    const id = req.headers['user-id'];
    return this.commonService.createUserDatabase(id);
  }

  @Delete('db')
  async truncateDatabaseProcess(@Req() req): Promise<CommonOutput> {
    const id = req.headers['user-id'];
    return this.commonService.truncateUserDatabase(id);
  }

  @Post('test')
  async createTestUsers(@Req() req, @Body() body: any): Promise<CommonOutput> {
    const id = req.headers['user-id'];
    return this.commonService.createTestUsers(id, body);
  }
}

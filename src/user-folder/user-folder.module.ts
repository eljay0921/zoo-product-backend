import { Module } from '@nestjs/common';
import { UserFolderService } from './user-folder.service';
import { UserFolderController } from './user-folder.controller';

@Module({
  providers: [UserFolderService],
  controllers: [UserFolderController]
})
export class UserFolderModule {}

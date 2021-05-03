import { Module } from '@nestjs/common';
import { UserFolderResolver } from './user-folder.resolver';
import { UserFolderService } from './user-folder.service';

@Module({
  providers: [UserFolderResolver, UserFolderService]
})
export class UserFolderModule {}

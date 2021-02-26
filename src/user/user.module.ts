import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { User } from './entities/user.entity';
import { UsersResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Photo])],
    providers: [UsersResolver, UserService]
})
export class UserModule {}

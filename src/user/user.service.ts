import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePhotoInput, CreatePhotoOutput } from './dtos/create-photo.dto';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { Photo } from './entities/photo.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>, 
        @InjectRepository(Photo) private readonly photoRepo: Repository<Photo>
    ) {}

    async createUser(createUserInput:CreateUserInput) : Promise<CreateUserOutput> {
        try {
            
            const user = await this.userRepo.findOne({name: createUserInput.name});
            if (user)
            {
                return {
                    ok: false,
                    error: "Already exist user name.",
                }
            }
            const { id }= await this.userRepo.save(this.userRepo.create(createUserInput));

            return {
                ok: true,
                userNo: id
            }
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                error
            }
        }
    }

    async updatePhoto(id:number, createPhotoInput:CreatePhotoInput): Promise<CreatePhotoOutput> {
        try {
            
            const user = await this.userRepo.findOne({id});
            if (user)
            {
                await this.photoRepo.save(this.photoRepo.create({ user, ...createPhotoInput}));
            }
            else {
                return {
                    ok: false,
                    error: "Not exist user id.",
                }
            }

            return {
                ok: true
            }
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                error
            }
        }
    }
}

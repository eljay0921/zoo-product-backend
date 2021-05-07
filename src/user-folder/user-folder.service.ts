import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { getManager, Repository } from 'typeorm';
import { UserFolder } from './entities/user-folder.entity';

@Injectable()
export class UserFolderService {

    private readonly userFolderRepo: Repository<UserFolder>;
    constructor(@Inject(REQUEST) private readonly request) {
        this.userFolderRepo = getManager(this.request.dbname).getRepository(UserFolder);
    }

    async getUserFolders() : Promise<CommonOutput> {
        try {
            const userFolders = await this.userFolderRepo.find();
            return {
                ok: true,
                count : userFolders?.length,
                data: userFolders,
            }
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                error,
            }
        }
    }

    async createUserFolder(createUserFolderInput: UserFolder) : Promise<CommonOutput> {
        try {
            const result = await this.userFolderRepo.insert(this.userFolderRepo.create(createUserFolderInput));
            return {
                ok: true,
                data:{
                    folderId: result.raw.insertId,
                  }
            }
        } catch (error) {
            return {
                ok: false,
                error,
            }            
        }
    }

    async deleteUserFolder(id: number) : Promise<CommonOutput> {
        try {
            await this.userFolderRepo.delete({id});
            return {
                ok: true
            }
        } catch (error) {
            return {
                ok: false,
                error,
            }
        }
    }
}

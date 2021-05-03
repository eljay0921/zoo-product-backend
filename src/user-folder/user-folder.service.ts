import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getManager, Repository } from 'typeorm';
import { CreateUserFolderInputs, CreateUserFolderOutput } from './dtos/create-user-folder.dto';
import { DeleteUserFolderInput, DeleteUserFolderOutput } from './dtos/delete-user-folder.dto';
import { ReadUserFolderOutput } from './dtos/read-user-folder.dto';
import { UserFolder } from './entities/user-folder.entity';

@Injectable()
export class UserFolderService {

    private readonly userFolderRepo: Repository<UserFolder>;
    constructor(@Inject(REQUEST) private readonly request) {
        this.userFolderRepo = getManager(this.request.req.dbname).getRepository(UserFolder);
    }

    async getUserFolders() : Promise<ReadUserFolderOutput> {
        try {
            const userFolders = await this.userFolderRepo.find();
            return {
                ok: true,
                userFolders,
                count : userFolders?.length,
            }
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                error,
            }
        }
    }

    async createUserFolder(createUserFolderInput: CreateUserFolderInputs) : Promise<CreateUserFolderOutput> {
        try {
            await this.userFolderRepo.insert(this.userFolderRepo.create(createUserFolderInput.folders));
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error,
            }            
        }
    }

    async deleteUserFolder(deleteUserFolderInputs: DeleteUserFolderInput) : Promise<DeleteUserFolderOutput> {
        try {
            await this.userFolderRepo.delete(deleteUserFolderInputs.folderIds);
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

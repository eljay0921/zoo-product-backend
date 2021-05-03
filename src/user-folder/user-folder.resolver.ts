import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateUserFolderInputs, CreateUserFolderOutput } from "./dtos/create-user-folder.dto";
import { DeleteUserFolderInput, DeleteUserFolderOutput } from "./dtos/delete-user-folder.dto";
import { ReadUserFolderOutput } from "./dtos/read-user-folder.dto";
import { UserFolder } from "./entities/user-folder.entity";
import { UserFolderService } from "./user-folder.service";

@Resolver(() => UserFolder)
export class UserFolderResolver {
    constructor(private readonly userFolderService: UserFolderService) {}

    @Query(() => String)
    helloWorld2() {
        return 'Hi, this is user-folder-resolver';
    }

    @Query(() => ReadUserFolderOutput)
    async getUserFolders(): Promise<ReadUserFolderOutput> {
        return this.userFolderService.getUserFolders();
    }

    @Mutation(() => CreateUserFolderOutput)
    async createUserFolder(@Args('input') createUserFolderInput: CreateUserFolderInputs): Promise<CreateUserFolderOutput> {
        return this.userFolderService.createUserFolder(createUserFolderInput);
    }

    @Mutation(() => DeleteUserFolderOutput)
    async deleteUserFolder(@Args('input') deleteUserFolderInput: DeleteUserFolderInput): Promise<DeleteUserFolderOutput> {
        return this.userFolderService.deleteUserFolder(deleteUserFolderInput);
    }
}
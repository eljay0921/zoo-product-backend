import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreatePhotoInput, CreatePhotoOutput } from "./dtos/create-photo.dto";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly userService:UserService) {}

    @Mutation(returns => CreateUserOutput)
    async createUser(@Args('input') createUserInput:CreateUserInput): Promise<CreateUserOutput> {
        return this.userService.createUser(createUserInput);
    }

    @Mutation(returns => CreatePhotoOutput)
    async editPhoto(
            @Args('id') id:number,
            @Args('input') createPhotoInput:CreatePhotoInput
        ): Promise<CreateUserOutput> {
        return this.userService.updatePhoto(id, createPhotoInput);
    }
}
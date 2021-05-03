import { Field, InputType, ObjectType, OmitType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { UserFolder } from "../entities/user-folder.entity";

@InputType()
export class CreateUserFolderInput extends OmitType(UserFolder, ['id', 'createdAt', 'updatedAt']) {
}

@InputType()
export class CreateUserFolderInputs {
    @Field(() => [CreateUserFolderInput])
    folders: CreateUserFolderInput[];
}

@ObjectType()
export class CreateUserFolderOutput extends CoreOutput {}
import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { UserFolder } from "../entities/user-folder.entity";

@ObjectType()
export class ReadUserFolderOutput extends CoreOutput {
    @Field(() => Number, { nullable: true })
    count?: number = 0;

    @Field(() => [UserFolder], { nullable: true })
    userFolders?: UserFolder[];
}
import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";

@InputType()
export class DeleteUserFolderInput {
    @Field(() => [Number])
    folderIds: number[];
}

@ObjectType()
export class DeleteUserFolderOutput extends CoreOutput {}
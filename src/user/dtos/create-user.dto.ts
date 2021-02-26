import { Field, InputType, ObjectType, OmitType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { User } from "../entities/user.entity";

@InputType()
export class CreateUserInput extends OmitType(User, ['id', 'photos']) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {
    @Field(type => Number, { nullable:true })
    userNo?:number
}
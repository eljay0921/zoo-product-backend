import { Field, InputType, ObjectType, OmitType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { MasterItemExtend } from "../entities/master-items-extend.entity";
import { MasterItem } from "../entities/master-items.entity";

@InputType()
export class CreateMasterItemsInputExtend extends OmitType(MasterItemExtend, ['masterItem', 'createdAt']) {}
@InputType()
export class CreateMasterItemsInputBase extends OmitType(MasterItem, ['id', 'extendInfoList', 'createdAt', 'updatedAt']) {
    @Field(type => CreateMasterItemsInputExtend, { nullable:true })
    extInfo?:CreateMasterItemsInputExtend
}

@InputType()
export class CreateMasterItemsInput {
    @Field(type => [CreateMasterItemsInputBase])
    masterItems:CreateMasterItemsInputBase[]
}

//

@InputType()
export class CreateMasterItemsOutputExtend extends OmitType(MasterItemExtend, ['masterItem']) {}
@InputType()
export class CreateMasterItemsOutputBase extends OmitType(MasterItem, ['extendInfoList']) {
    @Field(type => CreateMasterItemsOutputExtend, { nullable:true })
    extInfo?:CreateMasterItemsOutputExtend
}

@ObjectType()
export class CreateMasterItemsOutput extends CoreOutput {
    @Field(type => [CreateMasterItemsOutputBase], { nullable:true })
    result?:CreateMasterItemsOutputBase[]
}
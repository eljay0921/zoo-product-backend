import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MasterItemExtend } from '../entities/master-items-extend.entity';
import { MasterItem } from '../entities/master-items.entity';
import { AdditionalInfo } from '../json-entities/master-items-additionalInfo.entity';

//#region  input DTO

@InputType()
export class CreateMasterItemsInputAdditionalInfo extends AdditionalInfo {}

@InputType()
export class CreateMasterItemsInputExtend extends OmitType(MasterItemExtend, [
  'masterItem',
  'createdAt',
]) {}

@InputType()
export class CreateMasterItemsInputBase extends OmitType(MasterItem, [
  'id',
  'additionalInfo',
  'extendInfoList',
  'createdAt',
  'updatedAt',
]) {

  @Field(() => CreateMasterItemsInputAdditionalInfo, { nullable:true })
  basicExtInfo?: CreateMasterItemsInputAdditionalInfo;

  @Field((type) => [CreateMasterItemsInputExtend], { nullable: true })
  extInfoList?: CreateMasterItemsInputExtend[];
}

@InputType()
export class CreateMasterItemsInput {
  @Field((type) => [CreateMasterItemsInputBase])
  masterItems: CreateMasterItemsInputBase[];
}

//#endregion

//#region output DTO
@ObjectType()
export class CreateMasterItemsResult {
  constructor(private readonly seq: number) {}

  @Field(() => Number)
  masterItemId?: number;

  @Field(() => String)
  message?: string;
}
@ObjectType()
export class CreateMasterItemsOutput extends CoreOutput {
  @Field(() => [CreateMasterItemsResult])
  result?: CreateMasterItemsResult[];
}
//#endregion

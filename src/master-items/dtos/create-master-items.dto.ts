import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MasterItemExtend } from '../entities/master-items-extend.entity';
import { MasterItem } from '../entities/master-items.entity';

//#region  input DTO
@InputType()
export class CreateMasterItemsInputExtend extends OmitType(MasterItemExtend, [
  'masterItem',
  'createdAt',
]) {}
@InputType()
export class CreateMasterItemsInputBase extends OmitType(MasterItem, [
  'id',
  'extendInfoList',
  'createdAt',
  'updatedAt',
]) {
  @Field((type) => CreateMasterItemsInputExtend, { nullable: true })
  extInfo?: CreateMasterItemsInputExtend;
}

@InputType()
export class CreateMasterItemsInput {
  @Field((type) => [CreateMasterItemsInputBase])
  masterItems: CreateMasterItemsInputBase[];
}

//#endregion

//#region output DTO
@InputType()
export class CreateMasterItemsOutputExtend extends OmitType(MasterItemExtend, [
  'masterItem',
]) {}
@InputType()
export class CreateMasterItemsOutputBase extends OmitType(MasterItem, [
  'extendInfoList',
]) {
  @Field((type) => CreateMasterItemsOutputExtend, { nullable: true })
  extInfo?: CreateMasterItemsOutputExtend;
}

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

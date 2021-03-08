import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MasterItemAddoption } from '../entities/master-items-addoption.entity';
import { MasterItemExtend } from '../entities/master-items-extend.entity';
import { MasterItemSelection } from '../entities/master-items-selection.entity';
import { MasterItem } from '../entities/master-items.entity';
import { MasterItemAdditionalInfo } from '../json-types/master-items-additionalInfo.type';
import { MasterItemCategoryInfo } from '../json-types/master-items-categoryInfo.type';
import { MasterItemSellingItemInfo } from '../json-types/master-items-sellingItemInfo.type';

//#region  input DTO

@InputType()
export class CategoryInfoInput extends MasterItemCategoryInfo {}

@InputType()
export class AdditionalInfoInput extends MasterItemAdditionalInfo {}

@InputType()
export class SellingItemInfoInput extends MasterItemSellingItemInfo {}

@InputType()
export class MasterItemSelectionInput extends OmitType(MasterItemSelection, [
  'masterItem',
  'createdAt',
]) {}

@InputType()
export class MasterItemAddOptionInput extends OmitType(MasterItemAddoption, [
  'masterItem',
  'createdAt',
]) {}

@InputType()
export class MasterItemExtendInput extends OmitType(MasterItemExtend, [
  'masterItem',
  'createdAt',
]) {}

@InputType()
export class MasterItemsBaseInput extends OmitType(MasterItem, [
  'id',
  'categoryInfo',
  'selectionInfoList',
  'addOptionInfoList',
  'additionalInfo',
  'sellingItemInfo',
  'extendInfoList',
  'createdAt',
  'updatedAt',
]) {

  @Field(() => CategoryInfoInput, { nullable:true })
  categoryInfoInput:CategoryInfoInput;

  @Field(() => [MasterItemSelectionInput], { nullable:true })
  selectionInfoListInput?: MasterItemSelectionInput[];

  @Field(() => [MasterItemAddOptionInput], { nullable:true })
  addOptionInfoListInput?: MasterItemAddOptionInput[];
  
  @Field(() => AdditionalInfoInput, { nullable:true })
  additionalInfoInput?: AdditionalInfoInput;

  @Field(() => SellingItemInfoInput, { nullable:true })
  sellingItemInfoInput?: SellingItemInfoInput;
  
  @Field((type) => [MasterItemExtendInput], { nullable: true })
  extendInfoListInput?: MasterItemExtendInput[];
}

@InputType()
export class CreateMasterItemsInput {
  @Field((type) => [MasterItemsBaseInput])
  masterItems: MasterItemsBaseInput[];
}

//#endregion

//#region output DTO
@ObjectType()
export class CreateMasterItemsResult {
  constructor(private readonly seq: number) {}

  @Field(() => Number)
  masterItemId: number;

  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable:true })
  message?: string;
}
@ObjectType()
export class CreateMasterItemsOutput extends CoreOutput {
  @Field(() => [CreateMasterItemsResult])
  result?: CreateMasterItemsResult[];
}
//#endregion

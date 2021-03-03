import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MasterItemExtend } from '../entities/master-items-extend.entity';
import { MasterItemSelection } from '../entities/master-items-selection.entity';
import { MasterItem } from '../entities/master-items.entity';
import { MasterItemAdditionalInfo } from '../json-entities/master-items-additionalInfo.entity';
import { MasterItemCategoryInfo } from '../json-entities/master-items-categoryInfo.entity';
import { MasterItemSellingItemInfo } from '../json-entities/master-items-sellingItemInfo.entity';

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
export class MasterItemExtendInput extends OmitType(MasterItemExtend, [
  'masterItem',
  'createdAt',
]) {}

@InputType()
export class MasterItemsBaseInput extends OmitType(MasterItem, [
  'id',
  'categoryInfo',
  'selectionInfoList',
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

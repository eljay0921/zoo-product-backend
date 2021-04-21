import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MasterItemAddoption } from '../entities/master-items-addoption.entity';
import { MasterItemExtend } from '../entities/master-items-extend.entity';
import { MasterItemImage } from '../entities/master-items-image.entity';
import { MasterItemSelectionBase } from '../entities/master-items-selection-base.entity';
import { MasterItemSelectionDetail } from '../entities/master-items-selection-detail.entity';
import { MasterItem } from '../entities/master-items.entity';
import { MasterItemAdditionalInfo } from '../json-types/master-items-additionalInfo.type';
import { MasterItemCategoryInfo } from '../json-types/master-items-categoryInfo.type';
import { MasterItemImageExtendInfo } from '../json-types/master-items-image-extendInfo.type';
import { MasterItemSelectionDetailExtend } from '../json-types/master-items-selection-detail-valueInfo.type';
import { MasterItemSellingItemInfo } from '../json-types/master-items-sellingItemInfo.type';

//#region input DTO

@InputType()
export class CategoryInfoInput extends MasterItemCategoryInfo {}

@InputType()
export class AdditionalInfoInput extends MasterItemAdditionalInfo {}

@InputType()
export class SellingItemInfoInput extends MasterItemSellingItemInfo {}

@InputType()
export class ImagesExtendInput extends MasterItemImageExtendInfo {}

@InputType()
export class MasterItemSelectionDetailExtendInput extends MasterItemSelectionDetailExtend {}

@InputType()
export class ImagesInput extends OmitType(MasterItemImage, [
  'masterItem',
  'extendInfo',
]) {
  @Field(() => ImagesExtendInput, { nullable: true })
  extendInfoInput?: ImagesExtendInput;
}

@InputType()
export class MasterItemSelectionDetailInput extends OmitType(
  MasterItemSelectionDetail,
  ['selectionBase', 'extendInfo', 'createdAt'],
) {
  @Field(() => MasterItemSelectionDetailExtendInput, { nullable: true })
  extendInput?: MasterItemSelectionDetailExtendInput;
}

@InputType()
export class MasterItemSelectionBaseInput extends OmitType(
  MasterItemSelectionBase,
  ['selectionId', 'masterItem', 'details', 'createAt'],
) {
  @Field(() => [MasterItemSelectionDetailInput], { nullable: true })
  detailsInput?: MasterItemSelectionDetailInput[];
}

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
  'categoryInfo',
  'images',
  'selectionBase',
  'addOptionInfoList',
  'additionalInfo',
  'sellingItemInfo',
  'extendInfoList',
  'createdAt',
  'updatedAt',
]) {
  @Field(() => CategoryInfoInput, { nullable: true })
  categoryInfoInput: CategoryInfoInput;

  @Field(() => [ImagesInput], { nullable: true })
  imagesInput?: ImagesInput[];

  @Field(() => MasterItemSelectionBaseInput, { nullable: true })
  selectionBaseInput?: MasterItemSelectionBaseInput;

  @Field(() => [MasterItemAddOptionInput], { nullable: true })
  addOptionInfoListInput?: MasterItemAddOptionInput[];

  @Field(() => AdditionalInfoInput, { nullable: true })
  additionalInfoInput?: AdditionalInfoInput;

  @Field(() => SellingItemInfoInput, { nullable: true })
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
  constructor(private readonly seq: number) {
    this.ok = false;
    this.messages = [];
  }

  @Field(() => Number, { nullable: true })
  masterItemId?: number;

  @Field(() => Boolean)
  ok: boolean;

  @Field(() => [String], { nullable: true })
  messages?: string[];
}
@ObjectType()
export class CreateMasterItemsOutput extends CoreOutput {
  constructor() {
    super();
    this.result = [];
  }

  @Field(() => Number)
  count?: number = 0;

  @Field(() => [CreateMasterItemsResult])
  result?: CreateMasterItemsResult[];
}
//#endregion

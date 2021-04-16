import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  CreateMasterItemsInput,
  CreateMasterItemsOutput,
  CreateMasterItemsResult,
  MasterItemsBaseInput,
} from './dtos/create-master-items.dto';
import {
  DeleteMasterItemsInput,
  DeleteMasterItemsOutput,
} from './dtos/delete-master-items.dto';
import { ReadMasterItemsOutput } from './dtos/read-master-items.dto';
import { MasterItemAddoption } from './entities/master-items-addoption.entity';
import { MasterItemExtend } from './entities/master-items-extend.entity';
import { MasterItemImage } from './entities/master-items-image.entity';
import { MasterItemSelectionBase } from './entities/master-items-selection-base.entity';
import { MasterItemSelectionDetail } from './entities/master-items-selection-detail.entity';
import { MasterItem } from './entities/master-items.entity';

@Injectable()
export class MasterItemsService {

  constructor(@Inject(REQUEST) private readonly request) {
    console.log('# pm2 id : ', process.env.pm_id);
  }

  async getMasterItemsWithRelations(
    ids: number[],
  ): Promise<ReadMasterItemsOutput> {

    console.log('getMasterItemsWithRelations');

    try {
      
        return {
          ok: false,
          count: 0,
        };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async getMasterItemsNoRelations(
    page: number,
    size: number,
  ): Promise<ReadMasterItemsOutput> {

    console.log('getMasterItemsNoRelations');
    try {
      if (page < 1) {
        return {
          ok: false,
          error: '페이지는 1이상의 값이어야 합니다.',
        };
      }

      if (size < 100 || size > 1000) {
        return {
          ok: false,
          error: '페이지의 크기는 100이상 1000이하의 값이어야 합니다.',
        };
      }

      return {
        ok: true,
        count: 0,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  private createMasterItemEntity(
    masterItemBase: MasterItemsBaseInput,
  ): MasterItem {
    // 이미지
    const images: MasterItemImage[] = [];
    const createImageEntityAsync = async () => {
      masterItemBase.imagesInput.forEach((image) => {
        const masterItemImage: MasterItemImage = { ...image };
        masterItemImage.extendInfo = image.extendInfoInput || undefined;

        images.push(masterItemImage);
      });
    };

    // 선택사항
    const selectionBase: MasterItemSelectionBase = {
      ...masterItemBase.selectionBaseInput,
      details: [],
    };
    const createSelectionEntityAsync = async () => {
      masterItemBase.selectionBaseInput.detailsInput.forEach(
        (selectionDetail) => {
          const masterItemSelectionDetail: MasterItemSelectionDetail = {
            ...selectionDetail,
            extendInfo: selectionDetail.extendInput || undefined,
          };
          selectionBase.details.push(masterItemSelectionDetail);
        },
      );
    };

    // 추가구성
    const addOptionInfoList: MasterItemAddoption[] = [];
    const createAddOptionEntityAsync = async () => {
      masterItemBase.addOptionInfoListInput.forEach((addOption) => {
        const masterItemAddOption: MasterItemAddoption = { ...addOption };
        addOptionInfoList.push(masterItemAddOption);
      });
    };

    // 확장정보
    const extendInfoList: MasterItemExtend[] = [];
    const createExtendEntityAsync = async () => {
      masterItemBase.extendInfoListInput?.forEach((ext) => {
        const extendInfo: MasterItemExtend = { ...ext };
        extendInfoList.push(extendInfo);
      });

      return extendInfoList;
    };

    Promise.all([
      createImageEntityAsync(),
      createSelectionEntityAsync(),
      createAddOptionEntityAsync(),
      createExtendEntityAsync(),
    ]);

    const masterItem: MasterItem = {
      ...masterItemBase,
      categoryInfo: masterItemBase.categoryInfoInput,
      additionalInfo: masterItemBase.additionalInfoInput || undefined,
      sellingItemInfo: masterItemBase.sellingItemInfoInput || undefined,
      images,
      selectionBase,
      addOptionInfoList,
      extendInfoList,
    };

    return masterItem;
  }

  async insertItems(
    createMasterItemsInput: CreateMasterItemsInput,
  ): Promise<CreateMasterItemsOutput> {

    console.log('insertItems');
    try {
      if (createMasterItemsInput.masterItems.length > 100) {
        return {
          ok: false,
          error: '원본상품은 한번에 최대 100개까지 한번에 등록 가능합니다.',
        };
      }

      const totalResult: CreateMasterItemsResult[] = [];
      return {
        ok: true,
        result: totalResult,
      };
    } catch (error) {
      console.log(error);
      return await {
        ok: false,
        error: `원본상품 생성 작업중 문제 발생 - ${error.message.substring(0, 200)}...`,
      };
    }
  }

  async insertItemsBulk(
    createMasterItemsInput: CreateMasterItemsInput,
  ): Promise<CreateMasterItemsOutput> {

    console.log('insertItemsBulk');
    try {
      if (createMasterItemsInput.masterItems.length > 100) {
        return {
          ok: false,
          error: '원본상품은 한번에 최대 100개까지 한번에 등록 가능합니다.',
        };
      }

      return {
        ok: true,
      };
    } catch (error) {
      console.log('원본상품 정보 입력 중 실패 : ', error);
      return await {
        ok: false,
        error: `원본상품 저장 실패 - ${error.message.substring(0, 200)}...`,
      };
    }
  }

  async deleteItems(
    deleteMasterItemsInput: DeleteMasterItemsInput,
  ): Promise<DeleteMasterItemsOutput> {
    try {
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return await {
        ok: false,
        error,
      };
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getManager, In, Repository } from 'typeorm';
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
  private readonly masterItemsRepo: Repository<MasterItem>;

  constructor(@Inject(REQUEST) private readonly request) {
    // console.log('Service : ', request.req.dbname);
    this.masterItemsRepo = getManager(this.request.req.dbname).getRepository(
      MasterItem,
    );
  }

  async getMasterItemsWithRelations(
    ids: number[],
  ): Promise<ReadMasterItemsOutput> {
    try {
      const masterItems = await this.masterItemsRepo.find({
        where: {
          id: In([ids]),
        },
        relations: [
          'images',
          'addOptionInfoList',
          'extendInfoList',
          'selectionBase',
          'selectionBase.details',
        ],
      });

      if (masterItems) {
        return {
          ok: true,
          count: masterItems.length,
          masterItems,
        };
      } else {
        return {
          ok: false,
          count: 0,
        };
      }
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

      const masterItems = await this.masterItemsRepo.find({
        skip: size * (page - 1),
        take: size,
        order: { id: 'ASC' },
      });

      return {
        ok: true,
        count: masterItems?.length,
        masterItems,
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
    try {
      if (createMasterItemsInput.masterItems.length > 100) {
        return {
          ok: false,
          error: '원본상품은 한번에 최대 100개까지 한번에 등록 가능합니다.',
        };
      }

      const totalResult: CreateMasterItemsResult[] = [];
      for (
        let index = 0;
        index < createMasterItemsInput.masterItems.length;
        index++
      ) {
        const eachResult = new CreateMasterItemsResult(index);
        try {
          const eachItem = createMasterItemsInput.masterItems[index];

          // 원본상품 중복 체크
          const existItem = await this.masterItemsRepo.findOne({
            id: eachItem.id,
          });

          if (existItem) {
            eachResult.ok = false;
            eachResult.messages.push('중복된 원본상품 번호입니다.');
            continue;
          }
          const masterItem: MasterItem = this.createMasterItemEntity(eachItem);

          // 원본상품 insert
          let insertedMasterItemId = 0;
          await this.masterItemsRepo
            .createQueryBuilder()
            .insert()
            .into(MasterItem)
            .values(masterItem)
            .execute()
            .then((result) => {
              insertedMasterItemId = result.raw.insertId;
              masterItem.selectionBase.masterItem = result.raw.insertId;
              masterItem.extendInfoList.forEach(
                (item) => (item.masterItem = result.raw.insertId),
              );
              masterItem.images.forEach(
                (item) => (item.masterItem = result.raw.insertId),
              );
              masterItem.addOptionInfoList.forEach(
                (item) => (item.masterItem = result.raw.insertId),
              );
            });

          // 선택사항 insert
          const insertSelectionInfoPromise = new Promise((resolve, reject) => {
            this.masterItemsRepo
              .createQueryBuilder()
              .insert()
              .into(MasterItemSelectionBase)
              .values({
                ...masterItem.selectionBase,
              })
              .execute()
              .then((result) => {
                masterItem.selectionBase.details.forEach(
                  (item) => (item.selectionBase = result.raw.insertId),
                );

                this.masterItemsRepo
                  .createQueryBuilder()
                  .insert()
                  .into(MasterItemSelectionDetail)
                  .values(masterItem.selectionBase.details)
                  .execute()
                  .then()
                  .catch((err) => reject(err));
              })
              .catch((err) => reject(err));

            resolve;
          });

          // 그 외 insert
          const insertAdditionalInfoPromise = new Promise((resolve, reject) => {
            this.masterItemsRepo
              .createQueryBuilder()
              .insert()
              .into(MasterItemImage)
              .values(masterItem.images)
              .execute()
              .catch((err) => reject(err));

            this.masterItemsRepo
              .createQueryBuilder()
              .insert()
              .into(MasterItemExtend)
              .values(masterItem.extendInfoList)
              .execute()
              .catch((err) => reject(err));

            this.masterItemsRepo
              .createQueryBuilder()
              .insert()
              .into(MasterItemAddoption)
              .values(masterItem.addOptionInfoList)
              .execute()
              .catch((err) => reject(err));

            resolve;
          });

          Promise.all([
            insertSelectionInfoPromise,
            insertAdditionalInfoPromise,
          ]).catch((err) => {
            console.log(err);
            eachResult.ok = false;
            eachResult.messages = err.message;
          });

          eachResult.masterItemId = insertedMasterItemId;
          eachResult.ok = true;
        } catch (error) {
          console.log(error);
          eachResult.masterItemId = -1;
          const errMsg = error.message.substring(0, 200);
          eachResult.messages.push(`원본상품 생성 실패 - ${errMsg}...`);
        } finally {
          totalResult.push(eachResult);
        }
      }

      return {
        ok: true,
        result: totalResult,
      };
    } catch (error) {
      console.log(error);
      return await {
        ok: false,
        error: `원본상품 생성 작업중 문제 발생 - ${error.message.substring(
          0,
          200,
        )}...`,
      };
    }
  }

  async deleteItems(
    deleteMasterItemsInput: DeleteMasterItemsInput,
  ): Promise<DeleteMasterItemsOutput> {
    try {
      await this.masterItemsRepo.delete(deleteMasterItemsInput.ids);

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

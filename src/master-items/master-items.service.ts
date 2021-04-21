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
  private readonly masterItemsExtendsRepo: Repository<MasterItemExtend>;
  private readonly masterItemsSelectionBaseRepo: Repository<MasterItemSelectionBase>;
  private readonly masterItemsSelectionDetailsRepo: Repository<MasterItemSelectionDetail>;
  private readonly masterItemsAddOptionsRepo: Repository<MasterItemAddoption>;
  private readonly masterItemsImagesRepo: Repository<MasterItemImage>;

  constructor(@Inject(REQUEST) private readonly request) {
    // console.log('Service : ', request.req.dbname);
    this.masterItemsRepo = getManager(this.request.req.dbname).getRepository(
      MasterItem,
    );

    this.masterItemsExtendsRepo = getManager(
      this.request.req.dbname,
    ).getRepository(MasterItemExtend);

    this.masterItemsSelectionBaseRepo = getManager(
      this.request.req.dbname,
    ).getRepository(MasterItemSelectionBase);

    this.masterItemsSelectionDetailsRepo = getManager(
      this.request.req.dbname,
    ).getRepository(MasterItemSelectionDetail);

    this.masterItemsAddOptionsRepo = getManager(
      this.request.req.dbname,
    ).getRepository(MasterItemAddoption);

    this.masterItemsImagesRepo = getManager(
      this.request.req.dbname,
    ).getRepository(MasterItemImage);
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

          const resultMasterItem = await this.masterItemsRepo.insert(
            masterItem,
          );

          masterItem.extendInfoList.forEach(
            (item) => (item.masterItem = resultMasterItem.raw.insertId),
          );
          const extendInsert = this.masterItemsExtendsRepo.insert(
            masterItem.extendInfoList,
          );

          masterItem.images.forEach(
            (item) => (item.masterItem = resultMasterItem.raw.insertId),
          );
          const imageInsert = this.masterItemsImagesRepo.insert(
            masterItem.images,
          );

          masterItem.addOptionInfoList.forEach(
            (item) => (item.masterItem = resultMasterItem.raw.insertId),
          );
          const addoptionInsert = this.masterItemsAddOptionsRepo.insert(
            masterItem.addOptionInfoList,
          );

          const selectionInsert = this.masterItemsSelectionBaseRepo
            .insert({
              masterItem: resultMasterItem.raw.insertId,
              ...masterItem.selectionBase,
            })
            .then((result) => {
              masterItem.selectionBase.details.forEach(
                (item) => (item.selectionBase = result.raw.insertId),
              );
              return this.masterItemsSelectionDetailsRepo.insert(
                masterItem.selectionBase.details,
              );
            });

          await Promise.all([
            extendInsert,
            imageInsert,
            addoptionInsert,
            selectionInsert,
          ]).then((results) => {
            eachResult.masterItemId = resultMasterItem.raw.insertId;
            eachResult.ok = true;
          });
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
      return {
        ok: false,
        error: `원본상품 생성 작업중 문제 발생 - ${error.message.substring(
          0,
          200,
        )}...`,
      };
    }
  }

  async insertItemsBulk(
    createMasterItemsInput: CreateMasterItemsInput,
  ): Promise<CreateMasterItemsOutput> {
    try {
      if (createMasterItemsInput.masterItems.length > 100) {
        return {
          ok: false,
          error: '원본상품은 한번에 최대 100개까지 한번에 등록 가능합니다.',
        };
      }

      const toInsertPromises: Promise<any>[] = [];
      const toInsertItemsTuple: [string, MasterItem][] = [];
      for (
        let index = 0;
        index < createMasterItemsInput.masterItems.length;
        index++
      ) {
        try {
          const eachItem = createMasterItemsInput.masterItems[index];
          const masterItem: MasterItem = this.createMasterItemEntity(eachItem);

          const insertPromise = this.masterItemsRepo
            .insert(masterItem)
            .then((result) =>
              toInsertItemsTuple.push([result.raw.insertId, masterItem]),
            );
          toInsertPromises.push(insertPromise);
        } catch (error) {
          console.log('Entity 객체 생성 중 실패 : ', error);
          return {
            ok: false,
            error: `원본상품 생성 실패 - ${error.message.substring(0, 200)}...`,
          };
        }
      }

      await Promise.all(toInsertPromises);

      const insertProcess = async () => {
        try {
          const extendList: MasterItemExtend[] = [];
          const images: MasterItemImage[] = [];
          const addoptions: MasterItemAddoption[] = [];
          const selectionBases: MasterItemSelectionBase[] = [];

          toInsertItemsTuple.forEach((item) => {
            const masterItemId = item[0];
            item[1].extendInfoList.forEach((item) => {
              item.masterItem = <any>masterItemId;
              extendList.push(item);
            });

            item[1].images.forEach((item) => {
              item.masterItem = <any>masterItemId;
              images.push(item);
            });

            item[1].addOptionInfoList.forEach((item) => {
              item.masterItem = <any>masterItemId;
              addoptions.push(item);
            });

            selectionBases.push({
              masterItem: <any>masterItemId,
              ...item[1].selectionBase,
            });
          });

          const insertExtendResult = this.masterItemsExtendsRepo.insert(
            extendList,
          );
          const insertImageResult = this.masterItemsImagesRepo.insert(images);
          const insertAddoptionResult = this.masterItemsAddOptionsRepo.insert(
            addoptions,
          );
          const insertSelectionResult = this.masterItemsSelectionBaseRepo
            .insert(selectionBases)
            .then((result) => {
              const selectionDetails: MasterItemSelectionDetail[] = [];
              toInsertItemsTuple.forEach((item, idx) => {
                const selectionBaseId = result.identifiers[idx].selectionId;
                item[1].selectionBase.details.forEach((item) => {
                  item.selectionBase = selectionBaseId;
                  selectionDetails.push(item);
                });
              });

              return this.masterItemsSelectionDetailsRepo.insert(
                selectionDetails,
              );
            });

          return await Promise.all([
            insertExtendResult,
            insertImageResult,
            insertAddoptionResult,
            insertSelectionResult,
          ]);
        } catch (error) {
          console.log(error);
        }
      };

      return insertProcess()
        .then((results) => {
          return {
            ok: true,
            count: toInsertItemsTuple?.length,
          };
        })
        .catch((err) => {
          return {
            ok: false,
            error: err.message,
          };
        });
    } catch (error) {
      console.log('원본상품 정보 입력 중 실패 : ', error);
      return {
        ok: false,
        error: `원본상품 저장 실패 - ${error.message.substring(0, 200)}...`,
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

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { getManager, In, InsertResult, Repository } from 'typeorm';
import { CreateMasterItemsResult } from './dtos/create-master-items.dto';
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
    this.masterItemsRepo = getManager(this.request.dbname).getRepository(
      MasterItem,
    );

    this.masterItemsExtendsRepo = getManager(this.request.dbname).getRepository(
      MasterItemExtend,
    );

    this.masterItemsSelectionBaseRepo = getManager(
      this.request.dbname,
    ).getRepository(MasterItemSelectionBase);

    this.masterItemsSelectionDetailsRepo = getManager(
      this.request.dbname,
    ).getRepository(MasterItemSelectionDetail);

    this.masterItemsAddOptionsRepo = getManager(
      this.request.dbname,
    ).getRepository(MasterItemAddoption);

    this.masterItemsImagesRepo = getManager(this.request.dbname).getRepository(
      MasterItemImage,
    );
  }

  async getOneMasterItemWithRelations(id: number): Promise<CommonOutput> {
    try {
      const masterItem = await this.masterItemsRepo.find({
        where: {
          id,
        },
        relations: [
          'images',
          'addOptionInfoList',
          'extendInfoList',
          'selectionBase',
          'selectionBase.details',
        ],
      });

      if (masterItem) {
        return {
          ok: true,
          data: masterItem,
        };
      } else {
        return {
          ok: false,
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

  async getMasterItemListWithRelations(ids: number[]): Promise<CommonOutput> {
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
          data: masterItems,
        };
      } else {
        return {
          ok: false,
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

  async getMasterItemListNoRelations(
    page: number,
    size: number,
  ): Promise<CommonOutput> {
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
        data: masterItems,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async insertItems(masterItemList: MasterItem[]): Promise<CommonOutput> {
    try {
      if (masterItemList.length > 100) {
        return {
          ok: false,
          error: '원본상품은 한번에 최대 100개까지 한번에 등록 가능합니다.',
        };
      }

      const totalResult: CreateMasterItemsResult[] = [];

      for (let index = 0; index < masterItemList.length; index++) {
        const eachResult = new CreateMasterItemsResult(index);
        try {
          const eachItem = masterItemList[index];

          // 원본상품 중복 체크
          const existItem = await this.masterItemsRepo.findOne({
            id: eachItem.id,
          });

          if (existItem) {
            eachResult.ok = false;
            eachResult.messages.push('중복된 원본상품 번호입니다.');
            continue;
          }
          // const masterItem: MasterItem = this.createMasterItemEntity(eachItem);
          const masterItem: MasterItem = eachItem;
          const resultMasterItem = await this.masterItemsRepo.insert(
            masterItem,
          );
          eachResult.masterItemId = resultMasterItem.raw.insertId;

          const eachPromises: Promise<InsertResult>[] = [];

          if (masterItem.extends) {
            masterItem.extends.forEach(
              (item) => (item.masterItem = resultMasterItem.raw.insertId),
            );
            const extendInsert = this.masterItemsExtendsRepo.insert(
              masterItem.extends,
            );

            eachPromises.push(extendInsert);
          }

          if (masterItem.images) {
            masterItem.images?.forEach(
              (item) => (item.masterItem = resultMasterItem.raw.insertId),
            );
            const imageInsert = this.masterItemsImagesRepo.insert(
              masterItem.images,
            );
            eachPromises.push(imageInsert);
          }

          if (masterItem.addOptions) {
            masterItem.addOptions.forEach(
              (item) => (item.masterItem = resultMasterItem.raw.insertId),
            );
            const addoptionInsert = this.masterItemsAddOptionsRepo.insert(
              masterItem.addOptions,
            );
            eachPromises.push(addoptionInsert);
          }

          if (masterItem.selection) {
            const selectionInsert = this.masterItemsSelectionBaseRepo
              .insert({
                masterItem: resultMasterItem.raw.insertId,
                ...masterItem.selection,
              })
              .then((result) => {
                if (masterItem.selection.details) {
                  masterItem.selection.details.forEach(
                    (item) => (item.selectionBase = result.raw.insertId),
                  );
                  return this.masterItemsSelectionDetailsRepo.insert(
                    masterItem.selection.details,
                  );
                }
              });

            eachPromises.push(selectionInsert);
          }

          await Promise.all(eachPromises)
            .then((results) => {
              eachResult.ok = true;
            })
            .catch((err) => {
              eachResult.ok = false;
              eachResult.messages.push(
                `원본상품 ${eachResult.masterItemId} : 개별 정보 입력 실패`,
                err,
              );
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
        data: totalResult,
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
    createMasterItemsInput: MasterItem[],
  ): Promise<CommonOutput> {
    try {
      if (createMasterItemsInput.length > 100) {
        return {
          ok: false,
          error: '원본상품은 한번에 최대 100개까지 한번에 등록 가능합니다.',
        };
      }

      const toInsertPromises: Promise<any>[] = [];
      const toInsertItemsTuple: [string, MasterItem][] = [];
      for (let index = 0; index < createMasterItemsInput.length; index++) {
        try {
          const eachItem = createMasterItemsInput[index];
          // const masterItem: MasterItem = this.createMasterItemEntity(eachItem);
          const masterItem: MasterItem = eachItem;

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
          const imageList: MasterItemImage[] = [];
          const addoptionList: MasterItemAddoption[] = [];
          const selectionList: MasterItemSelectionBase[] = [];

          toInsertItemsTuple?.forEach((item) => {
            const masterItemId = item[0];
            item[1].extends?.forEach((item) => {
              item.masterItem = <any>masterItemId;
              extendList.push(item);
            });

            item[1].images?.forEach((item) => {
              item.masterItem = <any>masterItemId;
              imageList.push(item);
            });

            item[1].addOptions?.forEach((item) => {
              item.masterItem = <any>masterItemId;
              addoptionList.push(item);
            });

            selectionList?.push({
              masterItem: <any>masterItemId,
              ...item[1].selection,
            });
          });

          const insertExtendResult = this.masterItemsExtendsRepo.insert(
            extendList,
          );
          const insertImageResult = this.masterItemsImagesRepo.insert(
            imageList,
          );
          const insertAddoptionResult = this.masterItemsAddOptionsRepo.insert(
            addoptionList,
          );
          const insertSelectionResult = this.masterItemsSelectionBaseRepo
            .insert(selectionList)
            .then((result) => {
              const selectionDetails: MasterItemSelectionDetail[] = [];
              toInsertItemsTuple?.forEach((item, idx) => {
                const selectionBaseId = result.identifiers[idx].selectionId;
                item[1].selection.details?.forEach((item) => {
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

  async deleteItems(ids: number[]): Promise<CommonOutput> {
    try {
      await this.masterItemsRepo.delete(ids);

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

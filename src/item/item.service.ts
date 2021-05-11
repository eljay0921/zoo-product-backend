import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { getManager, In, InsertResult, Repository } from 'typeorm';
import { CreateItemEachResult } from './dtos/create-item.dto';
import { Addoption } from './entities/item-addoption.entity';
import { Extend } from './entities/item-extend.entity';
import { Image } from './entities/item-image.entity';
import { SelectionDetail } from './entities/item-selection-detail.entity';
import { Selection } from './entities/item-selection.entity';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  private readonly itemRepo: Repository<Item>;
  private readonly itemExtendRepo: Repository<Extend>;
  private readonly itemSelectionRepo: Repository<Selection>;
  private readonly itemSelectionDetailRepo: Repository<SelectionDetail>;
  private readonly itemAddOptionRepo: Repository<Addoption>;
  private readonly itemImageRepo: Repository<Image>;

  constructor(@Inject(REQUEST) private readonly request) {
    // console.log('Service : ', request.req.dbname);
    this.itemRepo = getManager(this.request.dbname).getRepository(
      Item,
    );

    this.itemExtendRepo = getManager(this.request.dbname).getRepository(
      Extend,
    );

    this.itemSelectionRepo = getManager(
      this.request.dbname,
    ).getRepository(Selection);

    this.itemSelectionDetailRepo = getManager(
      this.request.dbname,
    ).getRepository(SelectionDetail);

    this.itemAddOptionRepo = getManager(
      this.request.dbname,
    ).getRepository(Addoption);

    this.itemImageRepo = getManager(this.request.dbname).getRepository(
      Image,
    );
  }

  async getOneMasterItemWithRelations(id: number): Promise<CommonOutput> {
    try {
      const masterItem = await this.itemRepo.find({
        where: {
          id,
        },
        relations: [
          'images',
          'addOptions',
          'extends',
          'selection',
          'selection.details',
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
      const masterItems = await this.itemRepo.find({
        where: {
          id: In([ids]),
        },
        relations: [
          'images',
          'addOptions',
          'extends',
          'selection',
          'selection.details',
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

      const masterItems = await this.itemRepo.find({
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

  async insertItems(masterItemList: Item[]): Promise<CommonOutput> {
    try {
      if (masterItemList.length > 100) {
        return {
          ok: false,
          error: '원본상품은 한번에 최대 100개까지 한번에 등록 가능합니다.',
        };
      }

      const totalResult: CreateItemEachResult[] = [];

      for (let index = 0; index < masterItemList.length; index++) {
        const eachResult = new CreateItemEachResult(index);
        try {
          const eachItem = masterItemList[index];

          // 원본상품 중복 체크
          const existItem = await this.itemRepo.findOne({
            id: eachItem.id,
          });

          if (existItem) {
            eachResult.ok = false;
            eachResult.messages.push('중복된 원본상품 번호입니다.');
            continue;
          }
          // const masterItem: MasterItem = this.createMasterItemEntity(eachItem);
          const masterItem: Item = eachItem;
          const resultMasterItem = await this.itemRepo.insert(
            masterItem,
          );
          eachResult.masterItemId = resultMasterItem.raw.insertId;

          const eachPromises: Promise<InsertResult>[] = [];

          if (masterItem.extends) {
            masterItem.extends.forEach(
              (item) => (item.masterItem = resultMasterItem.raw.insertId),
            );
            const extendInsert = this.itemExtendRepo.insert(
              masterItem.extends,
            );

            eachPromises.push(extendInsert);
          }

          if (masterItem.images) {
            masterItem.images?.forEach(
              (item) => (item.masterItem = resultMasterItem.raw.insertId),
            );
            const imageInsert = this.itemImageRepo.insert(
              masterItem.images,
            );
            eachPromises.push(imageInsert);
          }

          if (masterItem.addOptions) {
            masterItem.addOptions.forEach(
              (item) => (item.masterItem = resultMasterItem.raw.insertId),
            );
            const addoptionInsert = this.itemAddOptionRepo.insert(
              masterItem.addOptions,
            );
            eachPromises.push(addoptionInsert);
          }

          if (masterItem.selection) {
            const selectionInsert = this.itemSelectionRepo
              .insert({
                masterItem: resultMasterItem.raw.insertId,
                ...masterItem.selection,
              })
              .then((result) => {
                if (masterItem.selection.details) {
                  masterItem.selection.details.forEach(
                    (item) => (item.selectionBase = result.raw.insertId),
                  );
                  return this.itemSelectionDetailRepo.insert(
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
    createMasterItemsInput: Item[],
  ): Promise<CommonOutput> {
    try {
      if (createMasterItemsInput.length > 100) {
        return {
          ok: false,
          error: '원본상품은 한번에 최대 100개까지 한번에 등록 가능합니다.',
        };
      }

      const toInsertPromises: Promise<any>[] = [];
      const toInsertItemsTuple: [string, Item][] = [];
      for (let index = 0; index < createMasterItemsInput.length; index++) {
        try {
          const eachItem = createMasterItemsInput[index];
          // const masterItem: MasterItem = this.createMasterItemEntity(eachItem);
          const masterItem: Item = eachItem;

          const insertPromise = this.itemRepo
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
          const extendList: Extend[] = [];
          const imageList: Image[] = [];
          const addoptionList: Addoption[] = [];
          const selectionList: Selection[] = [];

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

          const insertExtendResult = this.itemExtendRepo.insert(
            extendList,
          );
          const insertImageResult = this.itemImageRepo.insert(
            imageList,
          );
          const insertAddoptionResult = this.itemAddOptionRepo.insert(
            addoptionList,
          );
          const insertSelectionResult = this.itemSelectionRepo
            .insert(selectionList)
            .then((result) => {
              const selectionDetails: SelectionDetail[] = [];
              toInsertItemsTuple?.forEach((item, idx) => {
                const selectionBaseId = result.identifiers[idx].selectionId;
                item[1].selection.details?.forEach((item) => {
                  item.selectionBase = selectionBaseId;
                  selectionDetails.push(item);
                });
              });

              return this.itemSelectionDetailRepo.insert(
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
      await this.itemRepo.delete(ids);

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

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
    this.itemRepo = getManager(this.request.dbname).getRepository(Item);

    this.itemExtendRepo = getManager(this.request.dbname).getRepository(Extend);

    this.itemSelectionRepo = getManager(this.request.dbname).getRepository(
      Selection,
    );

    this.itemSelectionDetailRepo = getManager(
      this.request.dbname,
    ).getRepository(SelectionDetail);

    this.itemAddOptionRepo = getManager(this.request.dbname).getRepository(
      Addoption,
    );

    this.itemImageRepo = getManager(this.request.dbname).getRepository(Image);
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
          'selections',
          'selections.details',
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
          'selections',
          'selections.details',
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
          const resultMasterItem = await this.itemRepo.insert(masterItem);
          eachResult.itemId = resultMasterItem.raw.insertId;

          const eachPromises: Promise<InsertResult>[] = [];

          if (masterItem.extends) {
            masterItem.extends.forEach((item) => (item.item = masterItem));
            const extendInsert = this.itemExtendRepo.insert(masterItem.extends);
            eachPromises.push(extendInsert);
          }

          if (masterItem.images) {
            masterItem.images?.forEach((item) => (item.item = masterItem));
            const imageInsert = this.itemImageRepo.insert(masterItem.images);
            eachPromises.push(imageInsert);
          }

          if (masterItem.addOptions) {
            masterItem.addOptions.forEach((item) => (item.item = masterItem));
            const addoptionInsert = this.itemAddOptionRepo.insert(
              masterItem.addOptions,
            );
            eachPromises.push(addoptionInsert);
          }

          if (masterItem.selections) {
            for (let i = 0; i < masterItem.selections.length; i++) {
              const selection = masterItem.selections[i];
              selection.item = masterItem;
              await this.itemSelectionRepo.insert(selection);

              if (selection.details) {
                selection.details.forEach(
                  (detail) => (detail.selection = selection),
                );
                const selectionInsertAll = this.itemSelectionDetailRepo.insert(
                  selection.details,
                );
                eachPromises.push(selectionInsertAll);
              }
            }
          }

          await Promise.all(eachPromises)
            .then((results) => {
              eachResult.ok = true;
            })
            .catch((err) => {
              eachResult.ok = false;
              eachResult.messages.push(
                `원본상품 ${eachResult.itemId} : 개별 정보 입력 실패`,
                err,
              );
            });
        } catch (error) {
          console.log(error);
          eachResult.itemId = -1;
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

  async insertItemsBulk(createMasterItemsInput: Item[]): Promise<CommonOutput> {
    try {
      if (createMasterItemsInput.length > 100) {
        return {
          ok: false,
          error: '원본상품은 한번에 최대 100개까지 한번에 등록 가능합니다.',
        };
      }

      const toInsertPromises: Promise<any>[] = [];
      const toInsertItems: Item[] = [];
      for (let index = 0; index < createMasterItemsInput.length; index++) {
        try {
          const masterItem: Item = createMasterItemsInput[index];
          const insertPromise = this.itemRepo
            .insert(masterItem)
            .then(() => toInsertItems.push(masterItem));

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
          const selectionDetailList: [number, SelectionDetail[]][] = [];

          toInsertItems?.forEach((item) => {
            item.extends?.forEach((ext) => {
              extendList.push({ item, ...ext });
            });

            item.images?.forEach((img) => {
              imageList.push({ item, ...img });
            });

            item.addOptions?.forEach((add) => {
              addoptionList.push({ item, ...add });
            });

            item.selections?.forEach((sel, idx) => {
              selectionList.push({ item, ...sel });
              selectionDetailList.push([idx, sel?.details]);
            });
          });

          const insertExtendResult = this.itemExtendRepo.insert(extendList);
          const insertImageResult = this.itemImageRepo.insert(imageList);
          const insertAddoptionResult = this.itemAddOptionRepo.insert(
            addoptionList,
          );
          const insertSelectionResult = this.itemSelectionRepo
            .insert(selectionList)
            .then((insertResults) => {
              const promises: Promise<InsertResult>[] = [];

              insertResults?.identifiers.forEach(async (identifier, idx) => {
                const details = selectionDetailList[idx][1];
                if (details) {
                  details.forEach(
                    (detail) =>
                      (detail.selection = <Selection>{
                        id: identifier.id,
                        type: identifier.type,
                      }),
                  );
                  const insertDetails = this.itemSelectionDetailRepo.insert(
                    details,
                  );
                  promises.push(insertDetails);
                }
              });

              return Promise.all(promises);
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
            count: toInsertItems?.length,
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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMasterItemsInput,
  CreateMasterItemsOutput,
  CreateMasterItemsResult,
} from './dtos/create-master-items.dto';
import { ReadMasterItemsOutput } from './dtos/read-master-items.dto';
import { MasterItemAddoption } from './entities/master-items-addoption.entity';
import { MasterItemExtend } from './entities/master-items-extend.entity';
import { MasterItemSelection } from './entities/master-items-selection.entity';
import { MasterItem } from './entities/master-items.entity';

@Injectable()
export class MasterItemsService {
  constructor(
    @InjectRepository(MasterItem)
    private readonly masterItemsRepo: Repository<MasterItem>,
    @InjectRepository(MasterItemExtend)
    private readonly masterItemsExtendsRepo: Repository<MasterItemExtend>,
    @InjectRepository(MasterItemSelection)
    private readonly masterItemsSelectionsRepo: Repository<MasterItemSelection>,
    @InjectRepository(MasterItemAddoption)
    private readonly masterItemsAddOptionsRepo: Repository<MasterItemAddoption>,
  ) {}

  async getItems(page: number, size: number): Promise<ReadMasterItemsOutput> {
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
        relations: ['selectionInfoList', 'addOptionInfoList', 'extendInfoList'],
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
        // GraphQL로 받은 데이터를 typeorm entity 데이터로 변환
        const eachItem = createMasterItemsInput.masterItems[index];
        const masterItem: MasterItem = {
          ...eachItem,
          categoryInfo: eachItem.categoryInfoInput,
          additionalInfo: eachItem.additionalInfoInput,
          sellingItemInfo: eachItem.sellingItemInfoInput,
        };

        // 원본상품 insert
        const resultMasterItem = await this.masterItemsRepo.save(
          this.masterItemsRepo.create(masterItem),
        );

        const eachResult = new CreateMasterItemsResult(index);
        if (resultMasterItem.id > 0) {
          eachResult.masterItemId = resultMasterItem.id;

          // 선택사항 insert
          const selectionPromise = new Promise((resolve, reject) => {
            const selectionInfoList: MasterItemSelection[] = [];
            eachItem.selectionInfoListInput?.forEach((selection) => {
              const selectionInfo: MasterItemSelection = {
                ...selection,
                masterItem: resultMasterItem,
              };
              selectionInfoList.push(selectionInfo);
            });

            const result = this.masterItemsSelectionsRepo.save(
              this.masterItemsSelectionsRepo.create(selectionInfoList),
            );

            if (result) {
              resolve(result);
            } else {
              reject();
            }
          });

          // 추가구성 insert
          const addOptionPromise = new Promise((resolve, reject) => {
            const addOptionInfoList: MasterItemAddoption[] = [];
            eachItem.addOptionInfoListInput?.forEach((addOption) => {
              const addOptionInfo: MasterItemAddoption = {
                ...addOption,
                masterItem: resultMasterItem,
              };
              addOptionInfoList.push(addOptionInfo);
            });

            const result = this.masterItemsAddOptionsRepo.save(
              this.masterItemsAddOptionsRepo.create(addOptionInfoList),
            );

            if (result) {
              resolve(result);
            } else {
              reject();
            }
          });

          // 확장정보 insert
          const extendPromise = new Promise((resolve, reject) => {
            const extendInfoList: MasterItemExtend[] = [];
            eachItem.extendInfoListInput?.forEach((ext) => {
              const extendInfo: MasterItemExtend = {
                ...ext,
                masterItem: resultMasterItem,
              };
              extendInfoList.push(extendInfo);
            });

            const result = this.masterItemsExtendsRepo.save(
              this.masterItemsExtendsRepo.create(extendInfoList),
            );

            if (result) {
              resolve(result);
            } else {
              reject();
            }
          });

          await Promise.all([selectionPromise, addOptionPromise, extendPromise])
            .then((result) => {
              eachResult.ok = true;
            })
            .catch((err) => {
              console.log(err);
              eachResult.ok = false;
              eachResult.message = err.sqlMessage?.toString();
            });
        } else {
          eachResult.masterItemId = -1;
          eachResult.message = '원본상품 생성 실패';
        }

        totalResult.push(eachResult);
      }

      return {
        ok: true,
        result: totalResult,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMasterItemsInput,
  CreateMasterItemsOutput,
  CreateMasterItemsResult,
} from './dtos/create-master-items.dto';
import { ReadMasterItemsOutput } from './dtos/read-master-items.dto';
import { MasterItemExtend } from './entities/master-items-extend.entity';
import { MasterItem } from './entities/master-items.entity';

@Injectable()
export class MasterItemsService {
  constructor(
    @InjectRepository(MasterItem)
    private readonly masterItems: Repository<MasterItem>,
    @InjectRepository(MasterItemExtend)
    private readonly masterItemsExtends: Repository<MasterItemExtend>,
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

      const masterItems = await this.masterItems.find({
        skip: size * (page - 1),
        take: size,
      });
      return {
        ok: true,
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
        const eachItem = createMasterItemsInput.masterItems[index];

        // 원본상품 insert
        const resultMasterItem = await this.masterItems.save(
          this.masterItems.create(eachItem),
        );

        const eachResult = new CreateMasterItemsResult(index);
        if (resultMasterItem.id > 0) {
          eachResult.masterItemId = resultMasterItem.id;

          // 확장정보 insert
          const extendInfoList: MasterItemExtend[] = [];
          eachItem.extInfoList.forEach((ext) => {
            const extendInfo = new MasterItemExtend();
            extendInfo.masterItem = resultMasterItem;
            extendInfo.marketCode = ext.marketCode;
            extendInfo.marketSubCode = ext.marketSubCode;
            extendInfo.info = ext.info;

            extendInfoList.push(extendInfo);
          });

          await this.masterItemsExtends.save(
            this.masterItemsExtends.create(extendInfoList),
          );
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

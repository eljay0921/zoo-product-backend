import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { removeTempField } from '@nestjs/graphql/dist/utils';
import { getManager, In, Repository } from 'typeorm';
import {
  CreateMasterItemsInput,
  CreateMasterItemsOutput,
  CreateMasterItemsResult,
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
  // constructor(
  //   @InjectRepository(MasterItem)
  //   private readonly masterItemsRepo: Repository<MasterItem>,
  //   @InjectRepository(MasterItemExtend)
  //   private readonly masterItemsExtendsRepo: Repository<MasterItemExtend>,
  //   @InjectRepository(MasterItemSelectionBase)
  //   private readonly masterItemsSelectionBaseRepo: Repository<MasterItemSelectionBase>,
  //   @InjectRepository(MasterItemSelectionDetail)
  //   private readonly masterItemsSelectionDetailsRepo: Repository<MasterItemSelectionDetail>,
  //   @InjectRepository(MasterItemAddoption)
  //   private readonly masterItemsAddOptionsRepo: Repository<MasterItemAddoption>,
  //   @InjectRepository(MasterItemImage)
  //   private readonly masterItemsImagesRepo: Repository<MasterItemImage>,
  // ) {}

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

  async getMasterItem(id: number): Promise<ReadMasterItemsOutput> {
    try {
      const masterItem = await this.masterItemsRepo.findOne({
        where: { id },
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
          count: 1,
          masterItems: [masterItem],
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

  async getMasterItems(
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
        relations: [
          'images',
          'addOptionInfoList',
          'extendInfoList',
          'selectionBase',
          'selectionBase.details',
        ],
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

          // 이미지
          const images: MasterItemImage[] = [];
          const createImageEntityAsync = async () => {
            eachItem.imagesInput.forEach((image) => {
              const masterItemImage: MasterItemImage = { ...image };
              masterItemImage.extendInfo = image.extendInfoInput || undefined;
  
              images.push(masterItemImage);
            });
          };

          // 선택사항
          const selectionBase: MasterItemSelectionBase = {
            ...eachItem.selectionBaseInput,
            details: [],
          };
          const createSelectionEntityAsync = async () => {
            eachItem.selectionBaseInput.detailsInput.forEach(
              (selectionDetail) => {
                const masterItemSelectionDetail: MasterItemSelectionDetail = {
                  ...selectionDetail,
                  extendInfo: selectionDetail.extendInput || undefined,
                };
                selectionBase.details.push(masterItemSelectionDetail);
              },
            );
          }

          // 추가구성
          const addOptionInfoList: MasterItemAddoption[] = [];
          const createAddOptionEntityAsync = async () => {
            eachItem.addOptionInfoListInput.forEach((addOption) => {
              const masterItemAddOption: MasterItemAddoption = { ...addOption };
              addOptionInfoList.push(masterItemAddOption);
            });
          };

          // 확장정보
          const extendInfoList: MasterItemExtend[] = [];
          const createExtendEntityAsync = async () => {
            eachItem.extendInfoListInput?.forEach((ext) => {
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
            ...eachItem,
            categoryInfo: eachItem.categoryInfoInput,
            additionalInfo: eachItem.additionalInfoInput || undefined,
            sellingItemInfo: eachItem.sellingItemInfoInput || undefined,
            images,
            selectionBase,
            addOptionInfoList,
            extendInfoList,
          };

          // 원본상품 insert
          const resultMasterItem = await this.masterItemsRepo.save(
            this.masterItemsRepo.create(masterItem),
          );

          eachResult.masterItemId = resultMasterItem.id;
          eachResult.ok = true;

        } catch (error) {
          console.log(error);
          eachResult.masterItemId = -1;
          eachResult.messages.push('원본상품 생성 실패');
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
        error,
      };
    }
  }

  async deleteItems(
    deleteMasterItemsInput: DeleteMasterItemsInput,
  ): Promise<DeleteMasterItemsOutput> {
    try {
      const result = await this.masterItemsRepo.delete(
        deleteMasterItemsInput.ids,
      );

      if (deleteMasterItemsInput.ids.length > result.affected) {
        return {
          ok: true,
          error: '일부 원본상품이 삭제되지 않았습니다.',
        };
      }

      return {
        ok: true,
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

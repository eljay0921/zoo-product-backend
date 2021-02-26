import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { CreateMasterItemsInput, CreateMasterItemsOutput } from "./dtos/create-master-items.dto";
import { ReadMasterItemsOutput } from "./dtos/read-master-items.dto";
import { MasterItemExtend } from "./entities/master-items-extend.entity";
import { MasterItem } from "./entities/master-items.entity";

@Injectable()
export class MasterItemsService {

    constructor(
        @InjectRepository(MasterItem) private readonly masterItems: Repository<MasterItem>,
        @InjectRepository(MasterItem) private readonly masterItemsExtends: Repository<MasterItemExtend>
    ) {}

    async getItems(page:number, size:number) : Promise<ReadMasterItemsOutput> {
        try {
            
            if (page < 1)
            {
                return {
                    ok: false,
                    error: "페이지는 1이상의 값이어야 합니다."
                }
            }
            
            if (size < 100 || size > 1000)
            {
                return {
                    ok: false,
                    error: "페이지의 크기는 100이상 1000이하의 값이어야 합니다."
                }
            }

            const masterItems = await this.masterItems.find( { skip: size * (page - 1), take: size } );
            return {
                ok: true,
                masterItems,
            }
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                error,
            }
        }
    }

    async insertItems(createMasterItemsInput:CreateMasterItemsInput): Promise<CreateMasterItemsOutput> {
        try {
            
            if (createMasterItemsInput.masterItems.length > 100)
            {
                return {
                    ok: false,
                    error: "원본상품은 최대 100개까지 한번에 등록 가능합니다."
                }
            }

            const result = await this.masterItems.save(this.masterItems.create(createMasterItemsInput.masterItems));
            return {
                ok: true,
                result
            }

        } catch (error) {
            console.log(error);
            return {
                ok: false,
                error,
            }
        }
    }
}
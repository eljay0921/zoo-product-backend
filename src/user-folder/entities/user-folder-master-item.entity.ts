import { IsNumber, IsOptional } from "class-validator";
import { MasterItem } from "src/master-items/entities/master-items.entity";
import { CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { UserFolder } from "./user-folder.entity";

@Entity('user_folder_master_item')
export class UserFolderMasterItem {

    @IsNumber()
    @ManyToOne(() => UserFolder, (folder) => folder.userFolderMasterItems, { primary:true, onDelete:'CASCADE' })
    userFolder: number;

    @IsNumber()
    @ManyToOne(() => MasterItem, (masterItem) => masterItem.userFolderMasterItems, { primary:true, onDelete:'CASCADE' })
    masterItem: number;

    @IsOptional()
    @CreateDateColumn()
    createdAt?: Date;
  
    @IsOptional()
    @CreateDateColumn()
    updatedAt?: Date;
}
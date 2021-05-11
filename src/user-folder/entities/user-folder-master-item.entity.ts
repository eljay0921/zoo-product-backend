import { IsNumber, IsOptional } from "class-validator";
import { Item } from "src/item/entities/item.entity";
import { CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { UserFolder } from "./user-folder.entity";

@Entity('user_folder_item')
export class UserFolderItem {

    @IsNumber()
    @ManyToOne(() => UserFolder, (folder) => folder.userFolderMasterItems, { primary:true, onDelete:'CASCADE' })
    userFolder: number;

    @IsNumber()
    @ManyToOne(() => Item, (masterItem) => masterItem.userFolderMasterItems, { primary:true, onDelete:'CASCADE' })
    masterItem: number;

    @IsOptional()
    @CreateDateColumn()
    createdAt?: Date;
  
    @IsOptional()
    @CreateDateColumn()
    updatedAt?: Date;
}
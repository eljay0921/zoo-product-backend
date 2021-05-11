import { IsNumber, IsOptional } from "class-validator";
import { Item } from "src/item/entities/item.entity";
import { CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Folder } from "./folder.entity";

@Entity('folder_item')
export class FolderItem {

    @IsNumber()
    @ManyToOne(() => Folder, (folder) => folder.folderItems, { primary:true, onDelete:'CASCADE' })
    folder: number;

    @IsNumber()
    @ManyToOne(() => Item, (item) => item.folderItems, { primary:true, onDelete:'CASCADE' })
    item: number;

    @IsOptional()
    @CreateDateColumn()
    createdAt?: Date;
  
    @IsOptional()
    @CreateDateColumn()
    updatedAt?: Date;
}
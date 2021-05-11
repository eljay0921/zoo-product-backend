import { IsNumber, IsOptional, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FolderItem } from "./folder-item.entity";

@Entity('folder')
export class Folder {
    @IsOptional()
    @IsNumber()
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id?: number;

    @IsOptional()
    @IsNumber()
    @Column({ type: 'int', unsigned: true, nullable: true })
    parentId?: number;

    @IsString()
    @Column({ length: 40 })
    name: string;
  
    @IsOptional()
    @CreateDateColumn()
    createdAt?: Date;
  
    @IsOptional()
    @CreateDateColumn()
    updatedAt?: Date;

    @IsOptional()
    @OneToMany(() => FolderItem, (folderItem) => folderItem.folder, {
        cascade: true,
      })
    // @Field(() => [UserFolderMasterItem], { nullable: true })
    folderItems?: FolderItem[];
}
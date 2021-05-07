import { IsNumber, IsOptional, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserFolderMasterItem } from "./user-folder-master-item.entity";

@Entity('user_folder')
export class UserFolder {
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
    @OneToMany(() => UserFolderMasterItem, (userFolderMasterItem) => userFolderMasterItem.userFolder, {
        cascade: true,
      })
    // @Field(() => [UserFolderMasterItem], { nullable: true })
    userFolderMasterItems?: UserFolderMasterItem[];
}
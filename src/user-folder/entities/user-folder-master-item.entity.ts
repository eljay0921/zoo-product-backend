import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { MasterItem } from "src/master-items/entities/master-items.entity";
import { CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { UserFolder } from "./user-folder.entity";

@InputType({ isAbstract: true })
@ObjectType()
@Entity('user_folder_master_item')
export class UserFolderMasterItem {

    @ManyToOne(() => UserFolder, (folder) => folder.userFolderMasterItems, { primary:true, onDelete:'CASCADE' })
    @Field(() => UserFolder)
    userFolder: number;

    @ManyToOne(() => MasterItem, (masterItem) => masterItem.userFolderMasterItems, { primary:true, onDelete:'CASCADE' })
    @Field(() => MasterItem)
    masterItem: number;

    @CreateDateColumn()
    @Field(() => Date, { nullable: true })
    createdAt?: Date;
  
    @CreateDateColumn()
    @Field(() => Date, { nullable: true })
    updatedAt?: Date;
}
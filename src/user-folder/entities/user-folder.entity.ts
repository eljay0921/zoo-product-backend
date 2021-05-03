import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserFolderMasterItem } from "./user-folder-master-item.entity";

@InputType({ isAbstract: true })
@ObjectType()
@Entity('user_folder')
export class UserFolder {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    @Field(() => Number, { nullable: true })
    id?: number;

    @Column({ type: 'int', unsigned: true, nullable: true })
    @Field(() => Number, { nullable: true })
    parentId?: number;

    @Column({ length: 40 })
    @Field(() => String)
    name: string;
  
    @CreateDateColumn()
    @Field(() => Date, { nullable: true })
    createdAt?: Date;
  
    @CreateDateColumn()
    @Field(() => Date, { nullable: true })
    updatedAt?: Date;

    // relationship
    @OneToMany(() => UserFolderMasterItem, (userFolderMasterItem) => userFolderMasterItem.userFolder, {
        cascade: true,
      })
    // @Field(() => [UserFolderMasterItem], { nullable: true })
    userFolderMasterItems?: UserFolderMasterItem[];
}
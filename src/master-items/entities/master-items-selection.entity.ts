import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { MasterItem } from "./master-items.entity";

@InputType({ isAbstract:true })
@ObjectType()
@Entity()
export class MasterItemSelection {
    @PrimaryColumn({ type: 'int'})
    @Field((type) => Number)
    selectionIndex: number;

    @ManyToOne(() => MasterItem, (master) => master.selectionList, {
        primary: true,
    })
    @Field((type) => MasterItem)
    masterItem: MasterItem;

    @Column()
    @Field((type) => Number)
    price: number;
  
    @Column()
    @Field((type) => Number)
    count: number;

    @Column({ length: 40, nullable: true })
    @Field((type) => String, { nullable: true })
    userCode?: string;

    @Column({ type: 'simple-json', nullable: true })
    @Field((type) => String, { nullable: true })
    valueInfo?: string;
    
    @Column({ type: 'simple-json', nullable: true })
    @Field((type) => String, { nullable: true })
    extendInfo?: string;

    @CreateDateColumn()
    @Field((type) => Date)
    createdAt: Date;
}
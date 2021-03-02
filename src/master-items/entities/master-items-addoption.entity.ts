import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { MasterItem } from "./master-items.entity";

@InputType({ isAbstract:true })
@ObjectType()
@Entity()
export class MasterItemAddoption {
    @PrimaryColumn({ type: 'int'})
    @Field((type) => Number)
    addOptionIndex: number;

    @ManyToOne(() => MasterItem, (master) => master.addOptionList, {
        primary: true,
    })
    @Field((type) => MasterItem)
    masterItem: MasterItem;

    @Column({ length: 100 })
    @Field((type) => String)
    name: string;

    @Column({ length: 100 })
    @Field((type) => String)
    value: string;

    @Column()
    @Field((type) => Number)
    price: number;
  
    @Column()
    @Field((type) => Number)
    count: number;

    @Column({ type: 'simple-json', nullable: true })
    @Field((type) => String, { nullable: true })
    extendInfo?: string;

    @CreateDateColumn()
    @Field((type) => Date)
    createdAt: Date;
}
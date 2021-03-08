import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType({ isAbstract:true })
@ObjectType()
@Entity()
export class MarketTemplates {
    @PrimaryGeneratedColumn()
    @Field((type) => Number)
    id?: number;

    @Column({ length: 1 })
    @Field((type) => String)
    marketCode: string;

    @Column({ length: 4 })
    @Field((type) => String)
    marketSubCode: string;

    @Column()
    @Field((type) => Number)
    smid: number;

    @Column({ length: 40 })
    @Field((type) => String)
    marketID: string;

    @Column({ length: 100 })
    @Field((type) => String)
    name: string;
    
    @Column({ length: 100 })
    @Field((type) => String)
    description: string;

    // TODO : JSON 타입으로 변경 => 구조는 상관 CSetInfoBase 참고
    @Column('simple-json')
    @Field((type) => String)
    baseInfo: string;

    @Column('simple-json')
    @Field((type) => String)
    basicExtendInfo: string;

    @Column('simple-json')
    @Field((type) => String)
    extendInfo: string;

    @Column('simple-json')
    @Field((type) => String)
    deliveryInfo: string;

    @Column('simple-json')
    @Field((type) => String)
    addServiceInfo: string;

    @Column('simple-json')
    @Field((type) => String)
    etcInfo: string;

    @CreateDateColumn()
    @Field((type) => Date)
    createdAt?: Date;
    
    @CreateDateColumn()
    @Field((type) => Date)
    updatedAt?: Date;
}
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./user.entity";

@InputType({ isAbstract:true })
@ObjectType()
@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number;

    @Column()
    @Field(type => String)
    url: string;

    @ManyToOne(() => User, user => user.photos)
    @Field(type => User)
    user: User;

}
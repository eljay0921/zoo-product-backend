import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Photo } from "./photo.entity";

@InputType({ isAbstract:true })
@ObjectType()
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number;

    @Column()
    @Field(type => String)
    name: string;

    @OneToMany(() => Photo, photo => photo.user)
    @Field(type => [Photo])
    photos: Photo[];

}
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MarketTemplates {
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Column({ length: 1 })
  marketCode: string;

  @IsOptional()
  @IsString()
  @Length(4, 4)
  @Column({ length: 4, nullable: true })
  marketSubCode?: string;

  @IsNumber()
  @Column()
  smid: number;

  @IsString()
  @Length(1, 40)
  @Column({ length: 40 })
  marketID: string;

  @IsString()
  @Length(1, 100)
  @Column({ length: 100 })
  name: string;

  @IsString()
  @Length(1, 100)
  @Column({ length: 100 })
  description: string;

  // TODO : JSON 타입으로 변경 => 구조는 상관 CSetInfoBase 참고
  @Column('simple-json')
  baseInfo: string;

  @IsOptional()
  @Column('simple-json', { nullable: true })
  basicExtendInfo?: string;

  @IsOptional()
  @Column('simple-json', { nullable: true })
  extendInfo?: string;

  @IsOptional()
  @Column('simple-json', { nullable: true })
  deliveryInfo?: string;

  @IsOptional()
  @Column('simple-json', { nullable: true })
  addServiceInfo?: string;

  @IsOptional()
  @Column('simple-json', { nullable: true })
  etcInfo?: string;

  @IsOptional()
  @CreateDateColumn()
  createdAt?: Date;

  @IsOptional()
  @CreateDateColumn()
  updatedAt?: Date;
}
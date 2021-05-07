import { IsDate, IsInt, IsJSON, IsString, Max } from "class-validator";

export class MarketTemplate {
  @IsInt()
  smid: number;
  @IsString()
  @Max(40)
  marketID: string;
  @IsString()
  @Max(100)
  name: string;
  @IsString()
  @Max(100)
  description: string;

  @IsString()
  baseInfo: string;
  @IsString()
  basicExtendInfo?: string;
  @IsString()
  extendInfo?: string;
  @IsString()
  deliveryInfo?: string;
  @IsString()
  addServiceInfo?: string;
  @IsString()
  etcInfo?: string;
}

export class CreateMarketTemplate extends MarketTemplate {
  @IsString()
  @Max(1)
  marketCode: string;

  @IsString()
  @Max(4)
  marketSubCode: string;
}

export class UpdateMarketTemplate extends MarketTemplate {
  @IsInt()
  id?: number;
  
  @IsDate()
  updatedAt?: Date;
}
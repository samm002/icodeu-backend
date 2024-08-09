import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePriceDetailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsArray()
  @IsOptional()
  features: string[];

  @IsNumber()
  @IsOptional()
  productId: number;

  @IsNumber()
  @IsOptional()
  serviceId: number;
}

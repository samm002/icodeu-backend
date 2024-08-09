import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ProductType } from '../../common/enums';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  type: ProductType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsArray()
  @IsOptional()
  features: string[];
}

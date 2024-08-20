import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ProductType } from '../../common/enums';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => (value === '' || value === null ? null : parseFloat(value)))
  price: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? null : parseFloat(value)))
  discount: number;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (value ? (Array.isArray(value) ? value : [value]) : []))
  features: string[];
}

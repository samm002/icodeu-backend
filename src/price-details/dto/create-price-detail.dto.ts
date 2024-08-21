import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
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
  @Transform(({ value }) => (value === '' || value === null ? null : parseFloat(value)))
  price: number;

  @IsNumber()
  @IsOptional()
  @Max(100)
  @Transform(({ value }) => (value === '' || value === null ? null : parseFloat(value)))
  discount: number;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (value ? (Array.isArray(value) ? value : [value]) : []))
  features: string[];

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (value ? (Array.isArray(value) ? value : [value]) : []))
  images: string[];

  @IsNumber()
  @IsOptional()
  productId: number;

  @IsNumber()
  @IsOptional()
  serviceId: number;
}

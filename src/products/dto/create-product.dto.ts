import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  type: string
  
  @IsString()
  @IsNotEmpty()
  name: string
  
  @IsString()
  @IsOptional()
  description: string
  
  @IsNumber()
  @IsNotEmpty()
  price: number
  
  @IsNumber()
  @IsOptional()
  discount: number
  
  @IsArray()
  @IsOptional()
  features: string[]
}

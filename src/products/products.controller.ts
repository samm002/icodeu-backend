import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';

import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';
import { Public, Roles } from '../common/decorators';
import { ResponseStatus, Role } from '../common/enums';
import { JwtGuard, RolesGuard } from '../common/guards';
import { ResponsePayload } from '../common/interfaces';

@UseGuards(JwtGuard, RolesGuard)
@Roles([Role.ADMIN, Role.PRODUCT_MANAGER])
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Public()
  @Get()
  async getAllProduct(): Promise<ResponsePayload<Product[]>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get All Product`,
      data: await this.productService.getAllProduct(),
    };
  }

  @Public()
  @Get(':id')
  async getProductById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ResponsePayload<Product>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get Product by id ${productId}`,
      data: await this.productService.getProductById(productId),
    };
  }

  @FormDataRequest()
  @Post()
  async createProduct(
    @Body() dto: CreateProductDto,
  ): Promise<ResponsePayload<Product>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Create New Product`,
      data: await this.productService.createProduct(dto),
    };
  }

  @FormDataRequest()
  @Patch(':id')
  async updateRoleById(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: UpdateProductDto,
  ): Promise<ResponsePayload<Product>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Update Product by id ${productId}`,
      data: await this.productService.updateProductById(productId, dto),
    };
  }

  @Delete(':id')
  async deleteRoleById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ResponsePayload<Product>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Delete Product by id ${productId}`,
      data: await this.productService.deleteProductById(productId),
    };
  }
}

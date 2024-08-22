import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';

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
    @Res() res: Response,
  ): Promise<void> {
    const product = await this.productService.createProduct(dto);
    res.redirect(`/admin/products/${product.id}`);
  }

  @FormDataRequest()
  @Patch(':id')
  async updateProductById(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: UpdateProductDto,
    @Res() res: Response,
  ): Promise<void> {
    const product = await this.productService.updateProductById(productId, dto);
    res.redirect(`/admin/products/${product.id}`);
  }

  @Delete(':id')
  async deleteProductById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ResponsePayload<Product>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Delete Product by id ${productId}`,
      data: await this.productService.deleteProductById(productId),
    };
  }
}

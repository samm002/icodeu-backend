import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateProductPriceDto } from './dto';
import { ProductPricesService } from './product-prices.service';
import { JwtGuard, RolesGuard } from '../common/guards';
import { Public, Roles } from '../common/decorators';

@UseGuards(JwtGuard, RolesGuard)
@Roles(['admin'])
@Controller('products/:productId/product-price')
export class ProductPricesController {
  constructor(private readonly productPriceServices: ProductPricesService) {}

  @Public()
  @Get()
  getAllProductPrice(@Param('productId', ParseIntPipe) productId: number) {
    return this.productPriceServices.getAllProductPrice(productId);
  }

  @Public()
  @Get(':id')
  getProductPriceById(@Param('productId', ParseIntPipe) productId: number, @Param('id', ParseIntPipe) productPriceId: number) {
    return this.productPriceServices.getProductPriceById(productId, productPriceId);
  }

  @Post()
  createProductPrice(@Param('productId', ParseIntPipe) productId: number, @Body() dto: CreateProductPriceDto) {
    return this.productPriceServices.createProductPrice(productId, dto);
  }

  @Patch(':id')
  updateProductPriceById(@Param('productId', ParseIntPipe) productId: number, @Param('id', ParseIntPipe) productPriceId: number, @Body() dto: CreateProductPriceDto) {
    return this.productPriceServices.updateProductPriceById(productId, productPriceId, dto);
  }

  @Delete(':id')
  deleteProductPriceById(@Param('productId', ParseIntPipe) productId: number, @Param('id', ParseIntPipe) productPriceId: number) {
    return this.productPriceServices.deleteProductPriceById(productId, productPriceId);
  }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { JwtGuard, RolesGuard } from '../common/guards';
import { Public, Roles } from '../common/decorators';

@UseGuards(JwtGuard, RolesGuard)
@Roles(['admin'])
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Public()
  @Get()
  getAllProduct() {
    return this.productService.getAllProduct();
  }

  @Public()
  @Get(':id')
  getProductById(@Param("id", ParseIntPipe) productId: number) {
    return this.productService.getProductById(productId);
  }
  
  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Patch(':id')
  updateRoleById(@Param("id", ParseIntPipe) productId: number, @Body() dto: UpdateProductDto) {
    return this.productService.updateProductById(productId, dto);
  }

  @Delete(':id')
  deleteRoleById(@Param("id", ParseIntPipe) productId: number) {
    return this.productService.deleteProductById(productId);
  }
}

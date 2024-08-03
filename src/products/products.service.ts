import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProduct() {
    const products = await this.prisma.product.findMany({
      include: {
        productPrices: true,
      },
    });

    return products;
  }

  async getProductById(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        productPrices: true,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id : ${productId} not found`);

    return product;
  }

  async createProduct(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        type: dto.type,
        name: dto.name,
        price: dto.price,
        ...dto,
      },
    });

    return product;
  }

  async updateProductById(productId: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id : ${productId} not found`);

    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...dto,
      },
      include: {
        productPrices: true,
      },
    });
  }

  async deleteProductById(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id : ${productId} not found`);

    return this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }
}

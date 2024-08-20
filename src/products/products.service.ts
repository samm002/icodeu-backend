import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';

import { CreateProductDto, UpdateProductDto } from './dto';
import { CommonService } from '../common/common.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private common: CommonService,
  ) {}

  async getAllProduct(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: {
        productPrices: true,
      },
    });
    return products;
  }

  async getProductById(productId: number): Promise<Product> {
    const product = this.findProductById(productId);

    return product;
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    let price: number;
    let discount: number;

    if (dto.price || dto.discount) {
      price = Number(dto.price)
      discount = Number(dto.discount)
    }
    if (dto.type !== 'multi' && !dto.price) {
      throw new BadRequestException('Please input price');
    }

    const discountedPrice =
      price && discount
        ? this.common.countDiscount(price, discount)
        : null;

    const product = await this.prisma.product.create({
      data: {
        type: dto.type,
        name: dto.name,
        price: price,
        discountedPrice: discountedPrice,
      },
    });

    return product;
  }

  async updateProductById(
    productId: number,
    dto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findProductById(productId);

    if (
      dto.type !== 'multi' &&
      product.type !== 'multi' &&
      !dto.price &&
      !product.price
    ) {
      throw new BadRequestException('Please input price');
    }

    const price = dto.price ?? product.price;
    const discount = dto.discount ?? product.discount;

    const discountedPrice =
      price && discount
        ? this.common.countDiscount(price, discount)
        : price || discount;

    return await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        discountedPrice: discountedPrice,
        ...dto,
      },
      include: {
        productPrices: true,
      },
    });
  }

  async deleteProductById(productId: number): Promise<Product> {
    await this.findProductById(productId);

    return await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }

  private async findProductById(productId: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id : ${productId} not found`);

    return product;
  }
}

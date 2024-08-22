import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';

import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  countDiscount,
  parseStringJSONToArray,
  transformToNumber,
} from '../common/utils';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProduct(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: {
        productPrices: true,
      },
    });
    return products;
  }

  async getProductById(productId: number): Promise<Product> {
    const product = await this.findProductById(productId);

    return product;
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    if (dto.type !== 'multi' && !dto.price) {
      throw new BadRequestException(
        "Please input price for product type 'single'",
      );
    }

    const [price, discount] = transformToNumber(dto.price, dto.discount);
    const features =
      typeof dto.features === 'string'
        ? dto.features === ''
          ? []
          : parseStringJSONToArray(dto.features)
        : dto.features;
    const images = parseStringJSONToArray(String(dto.images));

    const discountedPrice =
      dto.price && dto.discount ? countDiscount(price, discount) : null;

    const product = await this.prisma.product.create({
      data: {
        type: dto.type,
        name: dto.name,
        description: dto.description,
        price,
        discount,
        discountedPrice,
        features,
        images,
      },
    });

    return product;
  }

  async updateProductById(
    productId: number,
    dto: UpdateProductDto,
  ): Promise<Product> {
    console.log({ dto });
    const product = await this.findProductById(productId);
    console.log({ product });
    if (
      dto.type !== 'multi' &&
      product.type !== 'multi' &&
      !dto.price &&
      !product.price
    ) {
      throw new BadRequestException('Please input price');
    }

    const [updatedPrice, updatedDiscount] = transformToNumber(
      dto.price,
      dto.discount,
    );

    const price = updatedPrice ?? product.price;
    const discount = updatedDiscount ?? product.discount;

    const features = dto.features
      ? typeof dto.features === 'string'
        ? []
        : parseStringJSONToArray(String(dto.features))
      : product.features;
    const images = dto.images
      ? parseStringJSONToArray(String(dto.images))
      : product.images;

    const discountedPrice =
      price && discount
        ? countDiscount(price, discount)
        : (product.discountedPrice ?? null);

    return await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        type: dto.type,
        name: dto.name,
        description: dto.description,
        price,
        discount,
        discountedPrice,
        features,
        images,
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
      include: {
        productPrices: true,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id : ${productId} not found`);

    return product;
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductPriceDto, UpdateProductPriceDto } from './dto';

@Injectable()
export class ProductPricesService {
  constructor(private prisma: PrismaService) {}

  async getAllProductPrice(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id : ${productId} not found`);

    if (product.type !== 'multi')
      throw new BadRequestException("Product type must be 'multi'");
    
    const productPrices = await this.prisma.productPrices.findMany({
      where: {
        productId,
      },
    });

    return productPrices;
  }

  async getProductPriceById(productId: number, productPriceId: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id : ${productId} not found`);

    if (product.type !== 'multi')
      throw new BadRequestException("Product type must be 'multi'");

    const productPrice = await this.prisma.productPrices.findFirst({
      where: {
        productId,
        id: productPriceId
      },
    });

    return productPrice;
  }

  async createProductPrice(productId: number, dto: CreateProductPriceDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id : ${productId} not found`);

    if (product.type !== 'multi')
      throw new BadRequestException("Product type must be 'multi'");

    const productPrice = await this.prisma.productPrices.create({
      data: {
        name: dto.name,
        price: dto.price,
        productId,
        ...dto,
      },
    });

    return productPrice;
  }

  async updateProductPriceById(
    productId: number,
    productPriceId: number,
    dto: UpdateProductPriceDto,
  ) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id : ${productId} not found`);

    if (product.type !== 'multi')
      throw new BadRequestException("Product type must be 'multi'");

    const productPrice = await this.prisma.productPrices.findUnique({
      where: {
        id: productPriceId,
      },
    });

    if (!productPrice)
      throw new NotFoundException(
        `Product Price with id : ${productPriceId} not found`,
      );

    return await this.prisma.productPrices.update({
      where: {
        id: productPriceId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProductPriceById(productId: number, productPriceId: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id : ${productId} not found`);

    const productPrice = await this.prisma.productPrices.findUnique({
      where: {
        id: productPriceId,
      },
    });

    if (!productPrice)
      throw new NotFoundException(
        `Product Price with id : ${productPriceId} not found`,
      );

    return await this.prisma.productPrices.delete({
      where: {
        id: productPriceId,
      },
    });
  }
}

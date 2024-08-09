import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PriceDetail, Product, Service } from '@prisma/client';

import { CreatePriceDetailDto, UpdatePriceDetailDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductType, ServiceType } from '../common/enums';
import { CommonService } from '../common/common.service';

@Injectable()
export class PriceDetailsService {
  constructor(
    private prisma: PrismaService,
    private common: CommonService,
  ) {}

  // Product Price Detail
  async getAllProductPriceDetail(productId: number): Promise<PriceDetail[]> {
    await this.findProductById(productId);

    const productPriceDetails = await this.prisma.priceDetail.findMany({
      where: {
        productId,
      },
    });

    return productPriceDetails;
  }

  async getProductPriceDetailById(
    productId: number,
    productPriceDetailId: number,
  ): Promise<PriceDetail> {
    await this.findProductById(productId);

    const productPrice = this.findPriceDetailById(productPriceDetailId);

    return productPrice;
  }

  async createProductPriceDetail(
    productId: number,
    dto: CreatePriceDetailDto,
  ): Promise<PriceDetail> {
    await this.findProductById(productId);

    const discountedPrice =
      dto.price && dto.discount
        ? this.common.countDiscount(dto.price, dto.discount)
        : dto.price || dto.discount;

    const productPriceDetail = await this.prisma.priceDetail.create({
      data: {
        name: dto.name,
        price: dto.price,
        discountedPrice: discountedPrice,
        productId,
        serviceId: null,
        ...dto,
      },
    });

    return productPriceDetail;
  }

  async updateProductPriceDetailById(
    productId: number,
    productPriceDetailId: number,
    dto: UpdatePriceDetailDto,
  ): Promise<PriceDetail> {
    await this.findProductById(productId);

    const productDetail = await this.findPriceDetailById(productPriceDetailId);

    const price = dto.price ?? productDetail.price;
    const discount = dto.discount ?? productDetail.discount;

    const discountedPrice =
      price && discount
        ? this.common.countDiscount(price, discount)
        : price || discount;

    return await this.prisma.priceDetail.update({
      where: {
        id: productPriceDetailId,
      },
      data: {
        discountedPrice: discountedPrice,
        ...dto,
      },
    });
  }

  async deleteProductPriceById(
    productId: number,
    productPriceDetailId: number,
  ): Promise<PriceDetail> {
    await this.findProductById(productId);

    await this.findPriceDetailById(productPriceDetailId);

    return await this.prisma.priceDetail.delete({
      where: {
        id: productPriceDetailId,
      },
    });
  }

  // Service Price Detail
  async getAllServicePriceDetail(serviceId: number): Promise<PriceDetail[]> {
    await this.findServiceById(serviceId);

    const servicePriceDetails = await this.prisma.priceDetail.findMany({
      where: {
        serviceId,
      },
    });

    return servicePriceDetails;
  }

  async getServicePriceDetailById(
    serviceId: number,
    servicePriceDetailId: number,
  ): Promise<PriceDetail> {
    await this.findServiceById(serviceId);

    const servicePrice = this.findPriceDetailById(servicePriceDetailId);

    return servicePrice;
  }

  async createServicePriceDetail(
    serviceId: number,
    dto: CreatePriceDetailDto,
  ): Promise<PriceDetail> {
    await this.findServiceById(serviceId);

    const servicePriceDetail = await this.prisma.priceDetail.create({
      data: {
        name: dto.name,
        price: dto.price,
        serviceId,
        productId: null,
        ...dto,
      },
    });

    return servicePriceDetail;
  }

  async updateServicePriceDetailById(
    serviceId: number,
    servicePriceDetailId: number,
    dto: UpdatePriceDetailDto,
  ): Promise<PriceDetail> {
    await this.findServiceById(serviceId);

    await this.findPriceDetailById(servicePriceDetailId);

    return await this.prisma.priceDetail.update({
      where: {
        id: servicePriceDetailId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteServicePriceById(
    serviceId: number,
    servicePriceDetailId: number,
  ): Promise<PriceDetail> {
    await this.findServiceById(serviceId);

    await this.findPriceDetailById(servicePriceDetailId);

    return await this.prisma.priceDetail.delete({
      where: {
        id: servicePriceDetailId,
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

    if (product.type !== ProductType.MULTI)
      throw new BadRequestException(
        `Product type must be '${ProductType.MULTI}'`,
      );

    return product;
  }

  private async findServiceById(serviceId: number): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service)
      throw new NotFoundException(`Service with id : ${serviceId} not found`);

    if (service.type !== ServiceType.MULTI)
      throw new BadRequestException(
        `Service type must be '${ServiceType.MULTI}'`,
      );

    return service;
  }

  private async findPriceDetailById(
    priceDetailId: number,
  ): Promise<PriceDetail> {
    const priceDetail = await this.prisma.priceDetail.findUnique({
      where: {
        id: priceDetailId,
      },
    });

    if (!priceDetail)
      throw new NotFoundException(
        `Product Price Detail with id : ${priceDetailId} not found`,
      );

    return priceDetail;
  }
}

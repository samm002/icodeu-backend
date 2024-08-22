import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PriceDetail, Product, Service } from '@prisma/client';

import { CreatePriceDetailDto, UpdatePriceDetailDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductType, ServiceType } from '../common/enums';
import {
  countDiscount,
  parseStringJSONToArray,
  transformToNumber,
} from '../common/utils';

@Injectable()
export class PriceDetailsService {
  constructor(private prisma: PrismaService) {}

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

    const productPrice = await this.findPriceDetailById(productPriceDetailId);

    return productPrice;
  }

  async createProductPriceDetail(
    productId: number,
    dto: CreatePriceDetailDto,
  ): Promise<PriceDetail> {
    await this.findProductById(productId);

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

    const productPriceDetail = await this.prisma.priceDetail.create({
      data: {
        name: dto.name,
        description: dto.description,
        price,
        discount,
        discountedPrice,
        features,
        images,
        productId,
        serviceId: null,
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

    const [updatedPrice, updatedDiscount] = transformToNumber(
      dto.price,
      dto.discount,
    );

    const price = updatedPrice ?? productDetail.price;
    const discount = updatedDiscount ?? productDetail.discount;

    const features = dto.features
      ? typeof dto.features === 'string'
        ? []
        : parseStringJSONToArray(String(dto.features))
      : productDetail.features;

    const images = parseStringJSONToArray(String(dto.images));

    const discountedPrice =
      price && discount
        ? countDiscount(price, discount)
        : (productDetail.discountedPrice ?? null);

    return await this.prisma.priceDetail.update({
      where: {
        id: productPriceDetailId,
      },
      data: {
        name: dto.name,
        description: dto.description,
        price,
        discount,
        discountedPrice,
        features,
        images,
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

    const servicePriceDetail = await this.prisma.priceDetail.create({
      data: {
        name: dto.name,
        description: dto.description,
        price,
        discount,
        discountedPrice,
        features,
        images,
        productId: null,
        serviceId,
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

    const serviceDetail = await this.findPriceDetailById(servicePriceDetailId);

    const [updatedPrice, updatedDiscount] = transformToNumber(
      dto.price,
      dto.discount,
    );

    const price = updatedPrice ?? serviceDetail.price;
    const discount = updatedDiscount ?? serviceDetail.discount;

    const features = dto.features
      ? typeof dto.features === 'string'
        ? []
        : parseStringJSONToArray(String(dto.features))
      : serviceDetail.features;
    const images = parseStringJSONToArray(String(dto.images));

    const discountedPrice =
      price && discount
        ? countDiscount(price, discount)
        : (serviceDetail.discountedPrice ?? null);

    return await this.prisma.priceDetail.update({
      where: {
        id: servicePriceDetailId,
      },
      data: {
        name: dto.name,
        description: dto.description,
        price,
        discount,
        discountedPrice,
        features,
        images,
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

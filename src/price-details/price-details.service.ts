import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PriceDetail, Product, Service } from '@prisma/client';

import { CreatePriceDetailDto, UpdatePriceDetailDto } from './dto';
import { CommonService } from '../common/common.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductType, ServiceType } from '../common/enums';

@Injectable()
export class PriceDetailsService {
  constructor(
    private prisma: PrismaService,
    private common: CommonService,
  ) {}

  // Product Price Detail
  async getAllProductPriceDetail(productId: number): Promise<PriceDetail[]> {
    const product = await this.findProductById(productId);

    const productPriceDetails = await this.prisma.priceDetail.findMany({
      where: {
        productId: product.id,
      },
    });

    return productPriceDetails;
  }

  async getProductPriceDetailById(
    productId: number,
    productPriceDetailId: number,
  ): Promise<PriceDetail> {
    await this.findProductById(productId);

    const productPriceDetail =
      await this.findPriceDetailById(productPriceDetailId);

    return productPriceDetail;
  }

  async createProductPriceDetail(
    productId: number,
    dto: CreatePriceDetailDto,
  ): Promise<PriceDetail> {
    await this.findProductById(productId);

    const [price, discount] = this.common.transformToNumber(
      dto.price,
      dto.discount,
    );
    const features =
      typeof dto.features === 'string'
        ? dto.features === ''
          ? []
          : this.common.parseStringJSONToArray(dto.features)
        : dto.features;
    const images = this.common.parseStringJSONToArray(String(dto.images));

    const discountedPrice =
      dto.price && dto.discount
        ? this.common.countDiscount(price, discount)
        : null;

    const productPriceDetail = await this.prisma.priceDetail.create({
      data: {
        name: dto.name,
        slug: this.common.generateSlug(dto.name),
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

    const productPriceDetail =
      await this.findPriceDetailById(productPriceDetailId);

    const [updatedPrice, updatedDiscount] = this.common.transformToNumber(
      dto.price,
      dto.discount,
    );

    const price = updatedPrice ?? productPriceDetail.price;
    const discount = updatedDiscount ?? productPriceDetail.discount;

    const features = dto.features
      ? typeof dto.features === 'string'
        ? dto.features === ''
          ? []
          : this.common.parseStringJSONToArray(String(dto.features))
        : dto.features
      : productPriceDetail.features;

    const images = this.common.parseStringJSONToArray(String(dto.images));

    const discountedPrice =
      price && discount
        ? this.common.countDiscount(price, discount)
        : (productPriceDetail.discountedPrice ?? null);

    return await this.prisma.priceDetail.update({
      where: {
        id: productPriceDetail.id,
      },
      data: {
        name: dto.name,
        slug: dto.name
          ? this.common.generateSlug(dto.name)
          : productPriceDetail.slug,
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

    const productPriceDetail =
      await this.findPriceDetailById(productPriceDetailId);

    return await this.prisma.priceDetail.delete({
      where: {
        id: productPriceDetail.id,
      },
    });
  }

  // Service Price Detail
  async getAllServicePriceDetail(serviceId: number): Promise<PriceDetail[]> {
    const service = await this.findServiceById(serviceId);

    const servicePriceDetails = await this.prisma.priceDetail.findMany({
      where: {
        serviceId: service.id,
      },
    });

    return servicePriceDetails;
  }

  async getServicePriceDetailById(
    serviceId: number,
    servicePriceDetailId: number,
  ): Promise<PriceDetail> {
    await this.findServiceById(serviceId);

    const servicePriceDetail = this.findPriceDetailById(servicePriceDetailId);

    return servicePriceDetail;
  }

  async createServicePriceDetail(
    serviceId: number,
    dto: CreatePriceDetailDto,
  ): Promise<PriceDetail> {
    await this.findServiceById(serviceId);

    const [price, discount] = this.common.transformToNumber(
      dto.price,
      dto.discount,
    );

    const features =
      typeof dto.features === 'string'
        ? dto.features === ''
          ? []
          : this.common.parseStringJSONToArray(dto.features)
        : dto.features;

    const images = this.common.parseStringJSONToArray(String(dto.images));

    const discountedPrice =
      dto.price && dto.discount
        ? this.common.countDiscount(price, discount)
        : null;

    const servicePriceDetail = await this.prisma.priceDetail.create({
      data: {
        name: dto.name,
        slug: this.common.generateSlug(dto.name),
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

    const servicePriceDetail =
      await this.findPriceDetailById(servicePriceDetailId);

    const [updatedPrice, updatedDiscount] = this.common.transformToNumber(
      dto.price,
      dto.discount,
    );

    const price = updatedPrice ?? servicePriceDetail.price;
    const discount = updatedDiscount ?? servicePriceDetail.discount;

    const features = dto.features
      ? typeof dto.features === 'string'
        ? dto.features === ''
          ? []
          : this.common.parseStringJSONToArray(String(dto.features))
        : dto.features
      : servicePriceDetail.features;

    const images = this.common.parseStringJSONToArray(String(dto.images));

    const discountedPrice =
      price && discount
        ? this.common.countDiscount(price, discount)
        : (servicePriceDetail.discountedPrice ?? null);

    return await this.prisma.priceDetail.update({
      where: {
        id: servicePriceDetail.id,
      },
      data: {
        name: dto.name,
        slug: dto.name
          ? this.common.generateSlug(dto.name)
          : servicePriceDetail.slug,
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

    const servicePriceDetail =
      await this.findPriceDetailById(servicePriceDetailId);

    return await this.prisma.priceDetail.delete({
      where: {
        id: servicePriceDetail.id,
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

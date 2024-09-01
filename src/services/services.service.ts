import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Service } from '@prisma/client';

import { CreateServiceDto, UpdateServiceDto } from './dto';
import { CommonService } from '../common/common.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private common: CommonService, private prisma: PrismaService) {}

  async getAllService(): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      include: {
        servicePrices: true,
      }
    });

    return services;
  }

  async getServiceById(serviceId: number): Promise<Service> {
    const service = await this.findServiceById(serviceId);

    return service;
  }

  async createService(dto: CreateServiceDto): Promise<Service> {
    if (dto.type !== 'multi' && !dto.price) {
      throw new BadRequestException(
        "Please input price for product type 'single'",
      );
    }

    const [price, discount] = this.common.transformToNumber(dto.price, dto.discount);

    const features =
      typeof dto.features === 'string'
        ? dto.features === ''
          ? []
          : this.common.parseStringJSONToArray(dto.features)
        : dto.features;

    const images = this.common.parseStringJSONToArray(String(dto.images));

    const discountedPrice =
      dto.price && dto.discount ? this.common.countDiscount(price, discount) : null;

    const service = await this.prisma.service.create({
      data: {
        type: dto.type,
        name: dto.name,
        slug: this.common.generateSlug(dto.name),
        description: dto.description,
        price,
        discount,
        discountedPrice,
        features,
        images,
      },
    });

    return service;
  }

  async updateServiceById(
    serviceId: number,
    dto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.findServiceById(serviceId);

    if (
      dto.type !== 'multi' &&
      service.type !== 'multi' &&
      !dto.price &&
      !service.price
    ) {
      throw new BadRequestException('Please input price');
    }

    const [updatedPrice, updatedDiscount] = this.common.transformToNumber(
      dto.price,
      dto.discount,
    );

    const price = updatedPrice ?? service.price;
    const discount = updatedDiscount ?? service.discount;

    const features = dto.features
      ? typeof dto.features === 'string'
        ? dto.features === ''
          ? []
          : this.common.parseStringJSONToArray(String(dto.features))
        : dto.features
      : service.features;

    const images = dto.images
      ? this.common.parseStringJSONToArray(String(dto.images))
      : service.images;

    const discountedPrice =
      price && discount
        ? this.common.countDiscount(price, discount)
        : (service.discountedPrice ?? null);

    return await this.prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        type: dto.type,
        name: dto.name,
        slug: dto.name
          ? this.common.generateSlug(dto.name)
          : service.slug,
        description: dto.description,
        price,
        discount,
        discountedPrice,
        features,
        images,
      },
      include: {
        servicePrices: true,
      },
    });
  }

  async deleteServiceById(serviceId: number): Promise<Service> {
    const service = await this.findServiceById(serviceId);

    return await this.prisma.service.delete({
      where: {
        id: service.id,
      },
    });
  }

  private async findServiceById(serviceId: number): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        servicePrices: true,
      },
    });

    if (!service)
      throw new NotFoundException(`Service with id : ${serviceId} not found`);

    return service;
  }
}

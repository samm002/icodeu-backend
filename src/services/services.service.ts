import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Service } from '@prisma/client';

import { CreateServiceDto, UpdateServiceDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  countDiscount,
  parseStringJSONToArray,
  transformToNumber,
} from '../common/utils';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async getAllService(): Promise<Service[]> {
    const services = await this.prisma.service.findMany();

    return services;
  }

  async getServiceById(serviceId: number): Promise<Service> {
    const service = await this.findServiceById(serviceId);

    return service;
  }

  async createService(dto: CreateServiceDto): Promise<Service> {
    if (dto.type !== 'multi' && !dto.price) {
      throw new BadRequestException('Please input price');
    }

    const [price, discount] = transformToNumber(dto.price, dto.discount);
    const features = typeof dto.features === 'string' ? [] : dto.features;
    const images = parseStringJSONToArray(String(dto.images));

    const discountedPrice =
      dto.price && dto.discount ? countDiscount(price, discount) : null;

    const service = await this.prisma.service.create({
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

    const [updatedPrice, updatedDiscount] = transformToNumber(
      dto.price,
      dto.discount,
    );

    const price = updatedPrice ?? service.price;
    const discount = updatedDiscount ?? service.discount;

    const discountedPrice =
      price && discount
        ? countDiscount(price, discount)
        : (service.discountedPrice ?? null);

    return await this.prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        discountedPrice,
        ...dto,
      },
      include: {
        servicePrices: true,
      },
    });
  }

  async deleteServiceById(serviceId: number): Promise<Service> {
    await this.findServiceById(serviceId);

    return await this.prisma.service.delete({
      where: {
        id: serviceId,
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

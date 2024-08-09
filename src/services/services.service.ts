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
  constructor(
    private prisma: PrismaService,
    private common: CommonService,
  ) {}

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

    const discountedPrice =
      dto.price && dto.discount
        ? this.common.countDiscount(dto.price, dto.discount)
        : dto.price || dto.discount;

    const service = await this.prisma.service.create({
      data: {
        type: dto.type,
        name: dto.name,
        discountedPrice: discountedPrice,
        ...dto,
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
      service.type !== 'multi' && !dto.price && !service.price
    ) {
      throw new BadRequestException('Please input price');
    }

    const price = dto.price ?? service.price;
    const discount = dto.discount ?? service.discount;

    const discountedPrice =
      price && discount
        ? this.common.countDiscount(price, discount)
        : price || discount;

    return await this.prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        discountedPrice: discountedPrice,
        ...dto,
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
    });

    if (!service)
      throw new NotFoundException(`Service with id : ${serviceId} not found`);

    return service;
  }
}

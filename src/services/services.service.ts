import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async getAllService() {
    const services = await this.prisma.service.findMany();

    return services;
  }

  async getServiceById(serviceId: number) {
    const service = await this.prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service)
      throw new NotFoundException(`Service with id : ${serviceId} not found`);

    return service;
  }

  async createService(dto: CreateServiceDto) {
    const service = await this.prisma.service.create({
      data: {
        name: dto.name,
        price: dto.price,
        ...dto,
      },
    });

    return service;
  }

  async updateServiceById(serviceId: number, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service)
      throw new NotFoundException(`Service with id : ${serviceId} not found`);

    return this.prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteServiceById(serviceId: number) {
    const service = await this.prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service)
      throw new NotFoundException(`Service with id : ${serviceId} not found`);

    return this.prisma.service.delete({
      where: {
        id: serviceId,
      },
    });
  }
}

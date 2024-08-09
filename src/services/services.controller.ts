import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Service } from '@prisma/client';

import { CreateServiceDto, UpdateServiceDto } from './dto';
import { ServicesService } from './services.service';
import { Public, Roles } from '../common/decorators';
import { ResponseStatus, Role } from '../common/enums';
import { JwtGuard, RolesGuard } from '../common/guards';
import { ResponsePayload } from 'src/common/interfaces';

@UseGuards(JwtGuard, RolesGuard)
@Roles([Role.ADMIN, Role.PRODUCT_MANAGER])
@Controller('services')
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) {}

  @Public()
  @Get()
  async getAllService(): Promise<ResponsePayload<Service[]>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: 'Get All Service',
      data: await this.serviceService.getAllService(),
    };
  }

  @Public()
  @Get(':id')
  async getServiceById(
    @Param('id', ParseIntPipe) serviceId: number,
  ): Promise<ResponsePayload<Service>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get Service by id ${serviceId}`,
      data: await this.serviceService.getServiceById(serviceId),
    };
  }

  @Post()
  async createService(
    @Body() dto: CreateServiceDto,
  ): Promise<ResponsePayload<Service>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: 'Create New Service',
      data: await this.serviceService.createService(dto),
    };
  }

  @Patch(':id')
  async updateServiceById(
    @Param('id', ParseIntPipe) serviceId: number,
    @Body() dto: UpdateServiceDto,
  ): Promise<ResponsePayload<Service>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Update Service by id ${serviceId}`,
      data: await this.serviceService.updateServiceById(serviceId, dto),
    };
  }

  @Delete(':id')
  async deleteServiceById(
    @Param('id', ParseIntPipe) serviceId: number,
  ): Promise<ResponsePayload<Service>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Delete Service by id ${serviceId}`,
      data: await this.serviceService.deleteServiceById(serviceId),
    };
  }
}

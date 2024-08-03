import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { JwtGuard, RolesGuard } from 'src/common/guards';
import { Public, Roles } from 'src/common/decorators';

@UseGuards(JwtGuard, RolesGuard)
@Roles(['admin'])
@Controller('services')
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) {}
  
  @Public()
  @Get()
  getAllService() {
    return this.serviceService.getAllService();
  }
  
  @Public()
  @Get(':id')
  getServiceById(@Param("id", ParseIntPipe) serviceId: number) {
    return this.serviceService.getServiceById(serviceId);
  }
  
  @Post()
  createService(@Body() dto: CreateServiceDto) {
    return this.serviceService.createService(dto);
  }

  @Patch(':id')
  updateServiceById(@Param("id", ParseIntPipe) serviceId: number, @Body() dto: UpdateServiceDto) {
    return this.serviceService.updateServiceById(serviceId, dto);
  }

  @Delete(':id')
  deleteServiceById(@Param("id", ParseIntPipe) serviceId: number) {
    return this.serviceService.deleteServiceById(serviceId);
  }
}

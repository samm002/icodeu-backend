import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PriceDetail } from '@prisma/client';

import { CreatePriceDetailDto, UpdatePriceDetailDto } from './dto';
import { PriceDetailsService } from './price-details.service';
import { Public, Roles } from '../common/decorators';
import { ResponseStatus, Role } from '../common/enums';
import { JwtGuard, RolesGuard } from '../common/guards';
import { ResponsePayload } from '../common/interfaces';
import { Response } from 'express';

@UseGuards(JwtGuard, RolesGuard)
@Roles([Role.ADMIN, Role.PRODUCT_MANAGER])
@Controller()
export class PriceDetailsController {
  constructor(private readonly priceDetailService: PriceDetailsService) {}

  // Product Price Detail
  @Public()
  @Get('products/:productId/price-detail')
  async getAllProductPriceDetail(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ResponsePayload<PriceDetail[]>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get All Product Price Detail in Product id ${productId}`,
      data: await this.priceDetailService.getAllProductPriceDetail(productId),
    };
  }

  @Public()
  @Get('products/:productId/price-detail/:id')
  async getProductPriceDetailById(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) productPriceId: number,
  ): Promise<ResponsePayload<PriceDetail>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get All Product Price Detail by id : ${productPriceId} in Product id ${productId}`,
      data: await this.priceDetailService.getProductPriceDetailById(
        productId,
        productPriceId,
      ),
    };
  }

  @Post('products/:productId/price-detail')
  async createProductPriceDetail(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreatePriceDetailDto,
    // @Res() res: Response,
  ): Promise<ResponsePayload<PriceDetail>> {
    // const productPriceDetail = await this.priceDetailService.createProductPriceDetail(
    //   productId,
    //   dto,
    // );
    // res.redirect(`/admin/productPriceDetail/${productPriceDetail.id}`);
    return {
      status: ResponseStatus.SUCCESS,
      message: `Create new Product Price Detail in Product id ${productId}`,
      data: await this.priceDetailService.createProductPriceDetail(
        productId,
        dto,
      ),
    };
  }

  @Patch('products/:productId/price-detail/:id')
  async updateProductPriceDetailById(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) productPriceDetailId: number,
    @Body() dto: UpdatePriceDetailDto,
    // @Res() res: Response,
  ): Promise<ResponsePayload<PriceDetail>> {
    // const productPriceDetail = await this.priceDetailService.updateProductPriceDetailById(
    //   productId,
    //   productPriceDetailId,
    //   dto,
    // );
    // res.redirect(`/admin/productPriceDetail/${productPriceDetail.id}`);
    return {
      status: ResponseStatus.SUCCESS,
      message: `Update Product Price Detail id ${productPriceDetailId} in Product id ${productId}`,
      data: await this.priceDetailService.updateProductPriceDetailById(
        productId,
        productPriceDetailId,
        dto,
      ),
    };
  }

  @Delete('products/:productId/price-detail/:id')
  async deleteProductPriceById(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) productPriceDetailId: number,
  ): Promise<ResponsePayload<PriceDetail>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Delete Product Price Detail id ${productPriceDetailId} in Product id ${productId}`,
      data: await this.priceDetailService.deleteProductPriceById(
        productId,
        productPriceDetailId,
      ),
    };
  }

  // Service Price Detail
  @Public()
  @Get('services/:serviceId/price-detail')
  async getAllServicePriceDetail(
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ): Promise<ResponsePayload<PriceDetail[]>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get All Service Price Detail in Service id ${serviceId}`,
      data: await this.priceDetailService.getAllServicePriceDetail(serviceId),
    };
  }

  @Public()
  @Get('services/:serviceId/price-detail/:id')
  async getServicePriceDetailById(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Param('id', ParseIntPipe) servicePriceId: number,
  ): Promise<ResponsePayload<PriceDetail>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get All Service Price Detail by id : ${servicePriceId} in Service id ${serviceId}`,
      data: await this.priceDetailService.getServicePriceDetailById(
        serviceId,
        servicePriceId,
      ),
    };
  }

  @Post('services/:serviceId/price-detail')
  async createservicePriceDetail(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Body() dto: CreatePriceDetailDto,
    // @Res() res: Response,
  ): Promise<ResponsePayload<PriceDetail>> {
    return {
    // const productPriceDetail = await this.priceDetailService.createProductPriceDetail(
    //   productId,
    //   dto,
    // );
    // res.redirect(`/admin/productPriceDetail/${productPriceDetail.id}`);
      status: ResponseStatus.SUCCESS,
      message: `Create new Service Price Detail in Service id ${serviceId}`,
      data: await this.priceDetailService.createServicePriceDetail(
        serviceId,
        dto,
      ),
    };
  }

  @Patch('services/:serviceId/price-detail/:id')
  async updateservicePriceDetailById(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Param('id', ParseIntPipe) servicePriceDetailId: number,
    @Body() dto: UpdatePriceDetailDto,
    // @Res() res: Response,
  ): Promise<ResponsePayload<PriceDetail>> {
    // const servicePriceDetail = await this.priceDetailService.updateServicePriceDetailById(
    //   serviceId,
    //   servicePriceDetailId,
    //   dto,
    // );
    // res.redirect(`/admin/servicePriceDetail/${servicePriceDetail.id}`);
    return {
      status: ResponseStatus.SUCCESS,
      message: `Update Service Price Detail id ${servicePriceDetailId} in Service id ${serviceId}`,
      data: await this.priceDetailService.updateServicePriceDetailById(
        serviceId,
        servicePriceDetailId,
        dto,
      ),
    };
  }

  @Delete('services/:serviceId/price-detail/:id')
  async deleteservicePriceById(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Param('id', ParseIntPipe) servicePriceDetailId: number,
  ): Promise<ResponsePayload<PriceDetail>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Delete Service Price Detail id ${servicePriceDetailId} in Service id ${serviceId}`,
      data: await this.priceDetailService.deleteServicePriceById(
        serviceId,
        servicePriceDetailId,
      ),
    };
  }
}

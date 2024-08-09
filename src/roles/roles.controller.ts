import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { CreateRoleDto, UpdateRoleDto } from './dto';
import { RolesService } from './roles.service';
import { Roles } from '../common/decorators';
import { ResponseStatus, Role as ROLE } from '../common/enums';
import { JwtGuard, RolesGuard } from '../common/guards';
import { ResponsePayload } from '../common/interfaces';

@UseGuards(JwtGuard, RolesGuard)
@Roles([ROLE.ADMIN])
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getAllRole(): Promise<ResponsePayload<Role[]>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get All Role`,
      data: await this.rolesService.getAllRole(),
    };
  }

  @Get(':id')
  async getRoleById(
    @Param('id', ParseIntPipe) roleId: number,
  ): Promise<ResponsePayload<Role>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Get Role by id ${roleId}`,
      data: await this.rolesService.getRoleById(roleId),
    };
  }

  @Post()
  async createRole(@Body() dto: CreateRoleDto): Promise<ResponsePayload<Role>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Create New Role`,
      data: await this.rolesService.createRole(dto),
    };
  }

  @Patch(':id')
  async updateRoleById(
    @Param('id', ParseIntPipe) roleId: number,
    @Body() dto: UpdateRoleDto,
  ): Promise<ResponsePayload<Role>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Update Role by id ${roleId}`,
      data: await this.rolesService.updateRoleById(roleId, dto),
    };
  }

  @Delete(':id')
  async deleteRoleById(
    @Param('id', ParseIntPipe) roleId: number,
  ): Promise<ResponsePayload<Role>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Delete Role by id ${roleId}`,
      data: await this.rolesService.deleteRoleById(roleId),
    };
  }
}

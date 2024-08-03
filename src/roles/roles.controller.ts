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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtGuard, RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@UseGuards(JwtGuard, RolesGuard)
@Roles(['admin'])
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getAllRole() {
    return this.rolesService.getAllRole();
  }
  
  @Get(':id')
  getRoleById(@Param("id", ParseIntPipe) roleId: number) {
    return this.rolesService.getRoleById(roleId);
  }
  
  @Post()
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Patch(':id')
  updateRoleById(@Param("id", ParseIntPipe) roleId: number, @Body() dto: UpdateRoleDto) {
    return this.rolesService.updateRoleById(roleId, dto);
  }

  @Delete(':id')
  deleteRoleById(@Param("id", ParseIntPipe) roleId: number) {
    return this.rolesService.deleteRoleById(roleId);
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Render,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/get-role.decorator';
import { ResponseStatus } from '../common/enums';
import { JwtGuard, RolesGuard } from '../common/guards';
import { ResponsePayload } from '../common/interfaces';
import { Public } from 'src/common/decorators';

@UseGuards(JwtGuard, RolesGuard)
@Roles(['admin'])
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Public()
  @Get('dashboards')
  @Render('dashboard/index')
  async dashboard() {
    const users = await this.adminService.getAllUsers();
    return { users, title: 'Dashboard' };
  }

  @Public()
  @Get('users')
  @Render('dashboard/users/index')
  async users() {
    const users = await this.adminService.getAllUsers();
    return { users, title: 'Users' };
  }

  @Public()
  @Get('products')
  @Render('dashboard/products/index')
  async products() {
    const users = await this.adminService.getAllUsers();
    return { users, title: 'Products' };
  }

  @Public()
  @Get('services')
  @Render('dashboard/services/index')
  async services() {
    const users = await this.adminService.getAllUsers();
    return { users, title: 'Services' };
  }

  @Public()
  @Get('blogs')
  @Render('dashboard/blogs/index')
  async blogs() {
    const users = await this.adminService.getAllUsers();
    return { users, title: 'Blogs' };
  }
}

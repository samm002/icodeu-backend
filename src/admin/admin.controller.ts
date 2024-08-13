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
  @Get('dashboard')
  @Render('dashboard/index')
  async dashboard()  {
    const users = await this.adminService.getAllUsers()
    return {users}
  }
}

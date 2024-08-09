import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/get-role.decorator';
import { ResponseStatus } from '../common/enums';
import { JwtGuard, RolesGuard } from '../common/guards';
import { ResponsePayload } from '../common/interfaces';

@UseGuards(JwtGuard, RolesGuard)
@Roles(['admin'])
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  async dashboard(): Promise<ResponsePayload<string>> {
    return {
      status: ResponseStatus.SUCCESS,
      message: `Viewing admin dashboard`,
      data: await this.adminService.getDashboard(), // mungkin nanti bakal jadi async
    };
  }
}

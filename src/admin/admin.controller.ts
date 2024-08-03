import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.at.guard';
import { Roles } from '../common/decorators/get-role.decorator';
import { RolesGuard } from '../common/guards';

@UseGuards(JwtGuard, RolesGuard)
@Roles(['admin','copywriter'])
@Controller('admin')
export class AdminController {
  @Get('dashboard')
  dashboard() {
    return 'halo admin!';
  }
}

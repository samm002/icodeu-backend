import { Controller, Get } from '@nestjs/common';

@Controller('dashboard')
export class AdminService {
  @Get()
  getDashboard(): string {
    return 'Admin Dashboard';
  }
}

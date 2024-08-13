import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('dashboard')
export class AdminService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users;
  }
}

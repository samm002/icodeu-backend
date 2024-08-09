import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserData } from '../common/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private roleService: RolesService,
  ) {}
  async showProfile(user: User): Promise<UserData> {
    const roleName = await this.roleService.getRoleName(user.roleId);

    const userData = {
      email: user.email,
      name: user.name,
      address: user.address,
      phoneNumber: user.phoneNumber,
      role: roleName,
    };

    return userData;
  }

  async editProfile(userId: number, dto: UpdateUserDto): Promise<UserData> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    const roleName = await this.roleService.getRoleName(user.roleId);

    const userData = {
      email: user.email,
      name: user.name,
      address: user.address,
      phoneNumber: user.phoneNumber,
      role: roleName,
    };

    return userData;
  }
}

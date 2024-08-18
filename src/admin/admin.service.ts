import {
  BadRequestException,
  Controller,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto } from './dto';
import { AuthenticationService } from '../authentication/authentication.service';
import { Role } from '../common/enums';
import * as argon from 'argon2';
import { CreateUserDto, UpdateUserDto } from '../users/dto';
import { RolesService } from '../roles/roles.service';

@Controller('dashboard')
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private authenticationService: AuthenticationService,
    private roleService: RolesService,
  ) {}

  // Admin Authentication
  async login(dto: AdminLoginDto) {
    const adminRoleId = await this.roleService.getRoleId(Role.ADMIN);
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user)
      throw new NotFoundException(
        `Invalid credential, no user found with email : ${dto.email}`,
      );

    const passwordMatches = await argon.verify(user.password, dto.password);

    if (!passwordMatches)
      throw new BadRequestException(
        "Invalid credential, password didn't match!",
      );

    if (user.roleId !== adminRoleId) {
      throw new UnauthorizedException('Admin login failed, user is not admin');
    }

    const tokens = await this.authenticationService.signToken(
      user.id,
      user.email,
    );

    await this.authenticationService.updateRefreshToken(
      user.id,
      tokens.refresh_token,
    );

    return tokens;
  }
}

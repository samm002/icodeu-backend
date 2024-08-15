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
  async adminLogin(dto: AdminLoginDto) {
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

  // User Management
  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users;
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }

  async createUser(dto: CreateUserDto, roleName: string): Promise<User> {
    const RoleId = await this.roleService.getRoleId(roleName);

    const password = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password,
        roleId: RoleId,
        ...dto,
      },
    });

    return user;
  }

  async updateUser(
    userId: number,
    roleName: string,
    dto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findUserById(userId);

    let newRoleId: number;

    if (roleName) {
      const roleId = await this.roleService.getRoleId(roleName);
      newRoleId = roleId;
    }

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
        roleId: newRoleId ? user.roleId : newRoleId,
      },
    });
  }

  async deleteUser(userId: number): Promise<User> {
    await this.findUserById(userId);

    const user = await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return user;
  }

  private async findUserById(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user)
      throw new NotFoundException(`User with id : ${userId} not found`);

    return user;
  }
}

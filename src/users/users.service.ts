import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';

import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './dto';
import { UserWithRole } from '../common/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private roleService: RolesService,
  ) {}

  // User Permission
  async showProfile(user: UserWithRole): Promise<ResponseUserDto> {
    return new ResponseUserDto(user);
  }

  async editProfile(
    userId: number,
    dto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
      include: {
        role: true,
      },
    });

    return new ResponseUserDto(user);
  }

  // Admin Permission
  // User Management
  async getAllUser(): Promise<ResponseUserDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        role: true,
      },
    });

    return users.map((user) => new ResponseUserDto(user));
  }

  async getUserById(userId: number): Promise<ResponseUserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
      },
    });

    return new ResponseUserDto(user);
  }

  async createUser(
    dto: CreateUserDto,
    roleName: string,
  ): Promise<ResponseUserDto> {
    const RoleId = await this.roleService.getRoleId(roleName);

    const password = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password,
        roleId: RoleId,
        ...dto,
      },
      include: {
        role: true,
      },
    });

    return new ResponseUserDto(user);
  }

  async updateUser(
    userId: number,
    roleName: string,
    dto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const user = await this.findUserById(userId);

    let newRoleId: number;

    if (roleName) {
      const roleId = await this.roleService.getRoleId(roleName);
      newRoleId = roleId;
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        roleId: newRoleId ?? user.roleId,
        ...dto,
      },
      include: {
        role: true,
      },
    });

    return new ResponseUserDto(updatedUser);
  }

  async deleteUser(userId: number): Promise<User> {
    const user = await this.findUserById(userId);

    return await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  }

  private async findUserById(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
      },
    });

    if (!user)
      throw new NotFoundException(`User with id : ${userId} not found`);

    return user;
  }

  async getUserName(userId: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user.name;
  }
}

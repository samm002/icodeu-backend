import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';

import { CreateUserDto, UpdateUserDto } from './dto';
import { UserData } from '../common/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private roleService: RolesService,
  ) {}

  // User Permission
  async showProfile(user: User): Promise<UserData> {
    const roleName = await this.roleService.getRoleName(user.roleId);

    const userData: UserData = {
      email: user.email,
      name: user.name,
      address: user.address,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
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

    const userData: UserData = {
      email: user.email,
      name: user.name,
      address: user.address,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      role: roleName,
    };

    return userData;
  }

  // Admin Permission
  // User Management
  async getAllUser(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return users;
  }

  async getUserById(userId: number): Promise<UserData> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const roleName = await this.roleService.getRoleName(user.roleId);

    const userData: UserData = {
      email: user.email,
      name: user.name,
      address: user.address,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      role: roleName,
    };

    return userData;
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

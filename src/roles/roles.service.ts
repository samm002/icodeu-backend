import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { CreateRoleDto, UpdateRoleDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getAllRole(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany();

    return roles;
  }

  async getRoleById(roleId: number): Promise<Role> {
    const role = await this.findRoleById(roleId);

    return role;
  }

  async createRole(dto: CreateRoleDto): Promise<Role> {
    try {
      const role = await this.prisma.role.create({
        data: {
          name: dto.name,
        },
      });

      return role;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Role name already taken');
        }
      }
      throw error;
    }
  }

  async updateRoleById(roleId: number, dto: UpdateRoleDto): Promise<Role> {
    await this.findRoleById(roleId);

    return await this.prisma.role.update({
      where: {
        id: roleId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteRoleById(roleId: number): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role)
      throw new NotFoundException(`Role with id : ${roleId} not found`);

    return await this.prisma.role.delete({
      where: {
        id: roleId,
      },
    });
  }

  private async findRoleById(roleId: number): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role)
      throw new NotFoundException(`Role with id : ${roleId} not found`);

    return role;
  }

  async getRoleId(roleName: string): Promise<number> {
    const role = await this.prisma.role.findUnique({
      where: {
        name: roleName,
      },
    });

    if (!role) throw new BadRequestException(`Role '${roleName}' not found`);

    return role.id;
  }

  async getRoleName(roleId: number): Promise<string> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role) throw new BadRequestException(`Role id '${roleId}' not found`);

    return role.name;
  }
}

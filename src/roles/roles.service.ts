import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getAllRole() {
    const roles = await this.prisma.role.findMany();

    return roles;
  }

  async getRoleById(roleId: number) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role)
      throw new NotFoundException(`Role with id : ${roleId} not found`);

    return role;
  }

  async createRole(dto: CreateRoleDto) {
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

  async updateRoleById(roleId: number, dto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role)
      throw new NotFoundException(`Role with id : ${roleId} not found`);

    return this.prisma.role.update({
      where: {
        id: roleId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteRoleById(roleId: number) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role)
      throw new NotFoundException(`Role with id : ${roleId} not found`);

    return this.prisma.role.delete({
      where: {
        id: roleId,
      },
    });
  }

  async getRoleName(roleId: number): Promise<string> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return role.name;
  }
}

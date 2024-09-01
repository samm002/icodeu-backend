import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from '../decorators';
import { RolesService } from '../../roles/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RolesService,
  ) {}

  matchRoles(roles: string[], userRole: string): boolean {
    if (!userRole) {
      return true;
    }

    return roles.flat().some((role) => userRole.includes(role));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const roles = this.reflector.getAll(Roles, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!roles) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userRoleName = await this.roleService.getRoleName(user.roleId);

    return this.matchRoles(roles, userRoleName);
  }
}

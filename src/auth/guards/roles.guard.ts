import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../enum/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!requiredRoles) return true; 

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user; 

    if (!user) throw new ForbiddenException('Usuario no encontrado');

    if (!requiredRoles.includes(user.role.name)) {
      throw new ForbiddenException('Permisos insuficientes para acceder a este recurso');
    }

    return true;
  }
}

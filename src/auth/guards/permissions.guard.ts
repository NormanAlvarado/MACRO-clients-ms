import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as microservices from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { envs } from 'src/config/envs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    @Inject(envs.grpcAuthService)
    private readonly client: microservices.ClientGrpc,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'];

    if (!user?.role?.name) {
      throw new UnauthorizedException('El usuario no tiene un rol asignado');
    }
    const permission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );
    if (!permission) {
      throw new ForbiddenException('No se definió el permiso requerido');
    }

    try {
      const response = (await firstValueFrom(
        this.client
          .getService('RoleService')
          [
            'verifyPermission'
          ]({ permission: String(permission), role: String(user.role.name) }),
      )) as { allowed: boolean };

      if (!response.allowed) {
        throw new ForbiddenException(
          `El rol '${user.role.name}' no tiene el permiso '${permission}'`,
        );
      }

      return true;
    } catch (error) {
      throw new ForbiddenException(
        error.message,
      );
    }
  }
}

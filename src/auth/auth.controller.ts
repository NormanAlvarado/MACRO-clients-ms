import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import * as microservices from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { envs } from 'src/config';
import { CurrentSession } from './guards/current.session.guard';
import { User } from './decorators/user.decorators';
import * as currentUserInterface from './interfaces/current-user.interface';
import { Roles } from './decorators/role.decorator';
import { Role } from './enum/user-role.enum';
import { RolesGuard } from './guards/roles.guard';
import { Permission } from './decorators/permission.decorator';
import { PermissionGuard } from './guards/permissions.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(envs.grpcAuthService)
    private readonly client: microservices.ClientGrpc,
  ) {}

  @UseGuards(CurrentSession, RateLimitGuard, RolesGuard, PermissionGuard)
  @Roles(Role.MODERATOR)
  @Permission('create:photo')
  @Get('test')
  testGuards(@User() user: currentUserInterface.CurrentUser) {
    return { user: user };
  }

  @Get()
  async check() {
    return this.client
      .getService('HealthService')
      ['HealthCheck']({})
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}

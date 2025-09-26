import { status } from '@grpc/grpc-js';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as microservices from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/config';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    @Inject(envs.grpcAuthService)
    private readonly client: microservices.ClientGrpc,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      
      // Verificaciones adicionales para GraphQL context
      if (!request) {
        console.log('⚠️ RateLimit Guard - No request found in context');
        return true; // Si no hay request, permitir por seguridad
      }

      const userId = request.user?.id;
      const ip = this.getClientIp(request);
      const endpoint = ctx.getInfo()?.fieldName || 'unknown'; // GraphQL field name
      const method = 'GRAPHQL';

      const payload = {
        userId,
        ip,
        endpoint,
        method,
      };

      console.log('🔍 RateLimit Guard - Payload:', payload);

      const result = (await firstValueFrom(
        this.client.getService('RateLimitService')['checkRateLimit'](payload),
      )) as { allowed: boolean };

      console.log('✅ RateLimit Guard - Result:', result);
      return result.allowed;
    } catch (error) {
      console.log('❌ RateLimit Guard - Error:', error.message);
      
      if (error.code === status.RESOURCE_EXHAUSTED) {
        throw new HttpException(
          error.details,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Para otros errores de conectividad gRPC, permitir el acceso y loguear
      if (error.code === status.UNAVAILABLE || error.message?.includes('UNKNOWN')) {
        console.log('⚠️ RateLimit Service unavailable, allowing request');
        return true;
      }

      throw new ForbiddenException(error.message || 'Acceso denegado');
    }
  }

  private getClientIp(request: any): string {
    return request.ip || 
           request.connection?.remoteAddress || 
           request.socket?.remoteAddress ||
           request.headers?.['x-forwarded-for']?.split(',')[0] ||
           'unknown';
  }
}

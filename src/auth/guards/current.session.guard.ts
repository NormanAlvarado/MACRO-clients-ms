import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as microservices from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/config';

@Injectable()
export class CurrentSession implements CanActivate {
  constructor(
    @Inject(envs.grpcAuthService)
    private readonly client: microservices.ClientGrpc,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    console.log('🔍 Guard - Request headers:', request?.headers);
    
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log('❌ Guard - No token found');
      throw new UnauthorizedException(
        'No se encontró el token de autenticación',
      );
    }
    
    console.log('🔍 Guard - Token found:', token?.substring(0, 20) + '...');
    
    try {
      const user = await firstValueFrom(
        this.client.getService('UserService')['validateUser']({ token }),
      );
      
      console.log('✅ Guard - User validated:', user);
      request['user'] = user;
      
    } catch (error) {
      console.log('❌ Guard - Token validation error:', error.message);
      
      if (error?.message?.includes('jwt expired') || error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado, por favor inicia sesión de nuevo');
      }
      
      throw new UnauthorizedException('El token no es válido');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GrpcModule } from 'src/transports/grpcTransports/grpc.module';

@Module({
  controllers: [AuthController],
  imports: [GrpcModule]
})
export class AuthModule {}

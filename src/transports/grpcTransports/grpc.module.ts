
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { envs } from 'src/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: envs.grpcAuthService,
        transport: Transport.GRPC,
        options: {
          package: 'auth', 
          protoPath: join(__dirname, './auth.proto'),
          url: envs.grpcAuthUrl,
        },
      },
    ]),
  ],
   exports: [ClientsModule],
})
export class GrpcModule {}

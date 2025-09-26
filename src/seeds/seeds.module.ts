import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../client/entities/client.entity';
import { ClientPreferences } from '../client/entities/client-preferences.entity';
import { GrpcModule } from '../transports/grpcTransports/grpc.module';
import { AuthSeedService } from './auth.seed';
import { ClientSeedService } from './client.seed';
import { ClientPreferencesSeedService } from './client-preferences.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ClientPreferences]),
    GrpcModule,
  ],
  providers: [
    AuthSeedService,
    ClientSeedService,
    ClientPreferencesSeedService,
  ],
  exports: [
    AuthSeedService,
    ClientSeedService,
    ClientPreferencesSeedService,
  ]
})
export class SeedsModule {}

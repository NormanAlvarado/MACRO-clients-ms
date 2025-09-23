import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../client/entities/client.entity';
import { ClientPreferences } from '../client/entities/client-preferences.entity';
import { ClientSeed } from './client.seed';
import { ClientPreferencesSeed } from './client-preferences.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ClientPreferences])
  ],
  providers: [ClientSeed, ClientPreferencesSeed],
  exports: [ClientSeed, ClientPreferencesSeed]
})
export class SeedsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { ClientPreferencesService } from './client-preferences.service';
import { ClientPreferencesResolver } from './client-preferences.resolver';
import { ClientAddressService } from './client-address.service';
import { ClientAddressResolver } from './client-address.resolver';
import { Client } from './entities/client.entity';
import { ClientPreferences } from './entities/client-preferences.entity';
import { ClientAddress } from './entities/client-address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ClientPreferences, ClientAddress])
  ],
  providers: [
    ClientResolver, 
    ClientService, 
    ClientPreferencesResolver, 
    ClientPreferencesService,
    ClientAddressResolver,
    ClientAddressService
  ],
  exports: [ClientService, ClientPreferencesService, ClientAddressService]
})
export class ClientModule {}

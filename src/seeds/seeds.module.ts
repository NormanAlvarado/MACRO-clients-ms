import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from '../client/entities/client.entity';
import { ClientSeed } from './client.seed';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])
  ],
  providers: [ClientSeed],
  exports: [ClientSeed]
})
export class SeedsModule {}

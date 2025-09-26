import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../client/entities/client.entity';
import { ClientPreferences } from '../client/entities/client-preferences.entity';

@Injectable()
export class ClientPreferencesSeedService {
  private readonly logger = new Logger(ClientPreferencesSeedService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ClientPreferences)
    private readonly clientPreferencesRepository: Repository<ClientPreferences>,
  ) {}

  async seed(): Promise<void> {
    try {
      this.logger.log('🌱 Iniciando seeding de preferencias de clientes...');

      // Verificar si ya existen preferencias
      const existingPreferences = await this.clientPreferencesRepository.count();
      if (existingPreferences > 0) {
        this.logger.warn(`⚠️ Ya existen ${existingPreferences} preferencias, omitiendo seeding...`);
        return;
      }

      // Obtener todos los clientes existentes
      const clients = await this.clientRepository.find();
      if (clients.length === 0) {
        this.logger.warn('⚠️ No hay clientes disponibles, no se pueden crear preferencias');
        return;
      }

      const preferencesData = [
        {
          idioma: 'es',
          notificaciones_email: true,
          notificaciones_push: false,
        },
        {
          idioma: 'en',
          notificaciones_email: false,
          notificaciones_push: true,
        },
        {
          idioma: 'es',
          notificaciones_email: true,
          notificaciones_push: true,
        },
      ];

      const preferences: ClientPreferences[] = [];
      
      // Asignar preferencias a los clientes
      for (let i = 0; i < clients.length; i++) {
        const preferenceTemplate = preferencesData[i % preferencesData.length];
        const clientPreference = this.clientPreferencesRepository.create({
          ...preferenceTemplate,
          cliente_id: clients[i].id,
          client: clients[i],
        });
        preferences.push(clientPreference);
      }

      await this.clientPreferencesRepository.save(preferences);

      this.logger.log(`✅ Se crearon ${preferences.length} preferencias de clientes exitosamente`);

    } catch (error) {
      this.logger.error('❌ Error durante el seeding de preferencias:', error.message);
      throw error;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../client/entities/client.entity';

@Injectable()
export class ClientSeedService {
  private readonly logger = new Logger(ClientSeedService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async seed(): Promise<void> {
    try {
      this.logger.log('🌱 Iniciando seeding de clientes...');

      // Verificar si ya existen clientes
      const existingClients = await this.clientRepository.count();
      if (existingClients > 0) {
        this.logger.warn(`⚠️ Ya existen ${existingClients} clientes, omitiendo seeding...`);
        return;
      }

      const seedClients = [
        {
          nombre: 'Juan Carlos Pérez',
          email: 'juan.perez@email.com',
          telefono: '+506 8888-1111',
        },
        {
          nombre: 'María José González',
          email: 'maria.gonzalez@email.com',
          telefono: '+506 8888-2222',
        },
        {
          nombre: 'Carlos Alberto Ramírez',
          email: 'carlos.ramirez@email.com',
          telefono: '+506 8888-3333',
        },
        {
          nombre: 'Ana Lucía Morales',
          email: 'ana.morales@email.com',
          telefono: '+506 8888-4444',
        },
        {
          nombre: 'Roberto Andrés Castillo',
          email: 'roberto.castillo@email.com',
          telefono: '+506 8888-5555',
        },
        {
          nombre: 'Laura Patricia Jiménez',
          email: 'laura.jimenez@email.com',
          telefono: '+506 8888-6666',
        },
        {
          nombre: 'Diego Fernando Vargas',
          email: 'diego.vargas@email.com',
          telefono: '+506 8888-7777',
        },
        {
          nombre: 'Sofia Isabel Herrera',
          email: 'sofia.herrera@email.com',
          telefono: '+506 8888-8888',
        },
        {
          nombre: 'Manuel Eduardo Castro',
          email: 'manuel.castro@email.com',
          telefono: '+506 8888-9999',
        },
        {
          nombre: 'Gabriela Alejandra Rojas',
          email: 'gabriela.rojas@email.com',
          telefono: '+506 8888-0000',
        },
      ];

      const clients = this.clientRepository.create(seedClients);
      await this.clientRepository.save(clients);

      this.logger.log(`✅ Se crearon ${clients.length} clientes exitosamente`);

    } catch (error) {
      this.logger.error('❌ Error durante el seeding de clientes:', error.message);
      throw error;
    }
  }
}

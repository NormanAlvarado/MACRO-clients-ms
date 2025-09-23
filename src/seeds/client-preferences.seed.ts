import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientPreferences } from '../client/entities/client-preferences.entity';
import { Client } from '../client/entities/client.entity';

@Injectable()
export class ClientPreferencesSeed {
  constructor(
    @InjectRepository(ClientPreferences)
    private preferencesRepository: Repository<ClientPreferences>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async run(force: boolean = false): Promise<void> {
    console.log('⚙️ Ejecutando seed de preferencias...');
    
    // Verificar si ya existen preferencias
    const existingPreferences = await this.preferencesRepository.count();
    
    console.log(`📊 Preferencias existentes en la base de datos: ${existingPreferences}`);
    
    if (existingPreferences > 0 && !force) {
      console.log('✅ Los datos de preferencias ya existen. Seed omitido.');
      console.log('💡 Si quieres recrear los datos, usa: npm run seed:force');
      return;
    }

    // Obtener todos los clientes
    const clients = await this.clientRepository.find();
    
    if (clients.length === 0) {
      console.log('❌ No hay clientes disponibles. Ejecuta primero el seed de clientes.');
      return;
    }

    // Crear preferencias simples para cada cliente
    const preferencesData = clients.map((client, index) => {
      const preferences = [
        { idioma: 'es', notificaciones_email: true, notificaciones_push: false },
        { idioma: 'en', notificaciones_email: true, notificaciones_push: true },
        { idioma: 'es', notificaciones_email: false, notificaciones_push: true },
      ];
      
      return {
        cliente_id: client.id,
        ...preferences[index % 3], // Rotar entre las 3 configuraciones
      };
    });

    // Insertar las preferencias
    await this.preferencesRepository.save(preferencesData);
    
    console.log(`✅ Seed de preferencias completado: ${preferencesData.length} preferencias creadas exitosamente.`);
  }
}

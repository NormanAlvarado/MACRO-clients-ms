import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../client/entities/client.entity';

@Injectable()
export class ClientSeed {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>
  ) {}

  async run(force: boolean = false): Promise<void> {
    // Verificar si ya existen clientes
    const existingClients = await this.clientModel.countDocuments();
    
    console.log(`📊 Clientes existentes en la base de datos: ${existingClients}`);
    
    if (existingClients > 0 && !force) {
      console.log('✅ Los datos de clientes ya existen. Seed omitido.');
      console.log('💡 Si quieres recrear los datos, usa: npm run seed:force');
      return;
    }

    if (existingClients > 0 && force) {
      console.log('🗑️  Eliminando clientes existentes...');
      await this.clientModel.deleteMany({});
      console.log('✅ Clientes eliminados.');
    }

    const seedClients = [
      {
        nombre: 'María García López',
        email: 'maria.garcia@email.com',
        telefono: '+34 612 345 678',
        direccion: 'Calle Mayor 123, Madrid, España',
      },
      {
        nombre: 'Carlos Rodríguez Martín',
        email: 'carlos.rodriguez@gmail.com',
        telefono: '+34 687 234 567',
        direccion: 'Avenida de la Constitución 45, Sevilla, España',
      },
      {
        nombre: 'Ana Fernández Silva',
        email: 'ana.fernandez@hotmail.com',
        telefono: '+34 623 456 789',
        direccion: 'Plaza del Sol 12, Barcelona, España',
      },
      {
        nombre: 'Luis Miguel Torres',
        email: 'luis.torres@yahoo.com',
        telefono: '+34 654 321 987',
        direccion: 'Calle de Alcalá 200, Madrid, España',
      },
      {
        nombre: 'Carmen Ruiz Delgado',
        email: 'carmen.ruiz@outlook.com',
        telefono: '+34 698 765 432',
        direccion: 'Rambla de Catalunya 78, Barcelona, España',
      },
      {
        nombre: 'José Antonio Morales',
        email: 'jose.morales@email.com',
        telefono: '+34 611 222 333',
        direccion: 'Calle Real 56, Granada, España',
      },
      {
        nombre: 'Isabel Jiménez Vega',
        email: 'isabel.jimenez@gmail.com',
        telefono: '+34 633 444 555',
        direccion: 'Avenida del Puerto 89, Valencia, España',
      },
      {
        nombre: 'Francisco Javier Herrera',
        email: 'fj.herrera@hotmail.com',
        telefono: '+34 677 888 999',
        direccion: 'Plaza de España 34, Bilbao, España',
      },
      {
        nombre: 'Pilar Sánchez Castro',
        email: 'pilar.sanchez@yahoo.com',
        telefono: '+34 655 111 222',
        direccion: 'Calle de la Paz 67, Zaragoza, España',
      },
      {
        nombre: 'Miguel Ángel Navarro',
        email: 'miguel.navarro@gmail.com',
        telefono: '+34 644 333 444',
        direccion: 'Avenida de Andalucía 123, Málaga, España',
      },
      {
        nombre: 'Rocío Álvarez Pérez',
        email: 'rocio.alvarez@outlook.com',
        telefono: '+34 688 555 666',
        direccion: 'Calle Nueva 45, Salamanca, España',
      },
      {
        nombre: 'Antonio Díaz Romero',
        email: 'antonio.diaz@email.com',
        telefono: '+34 622 777 888',
        direccion: 'Plaza Mayor 18, Valladolid, España',
      },
      {
        nombre: 'Elena Martínez Gómez',
        email: 'elena.martinez@gmail.com',
        telefono: '+34 666 999 111',
        direccion: 'Calle del Carmen 92, Murcia, España',
      },
      {
        nombre: 'Pedro Luis Ramírez',
        email: 'pedro.ramirez@hotmail.com',
        telefono: '+34 699 222 333',
        direccion: 'Avenida de América 156, Alicante, España',
      },
      {
        nombre: 'Dolores Vargas Iglesias',
        email: 'dolores.vargas@yahoo.com',
        telefono: '+34 611 444 555',
        direccion: 'Calle de Toledo 78, Córdoba, España',
      }
    ];

    try {
      await this.clientModel.insertMany(seedClients);
      console.log(`✅ Seed completado: ${seedClients.length} clientes creados exitosamente.`);
    } catch (error) {
      console.error('❌ Error al ejecutar seed de clientes:', error);
      throw error;
    }
  }
}

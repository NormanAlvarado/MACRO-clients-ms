import { DataSource } from 'typeorm';
import { Client } from '../src/client/entities/client.entity';
import { ClientPreferences } from '../src/client/entities/client-preferences.entity';
import { ClientAddress } from '../src/client/entities/client-address.entity';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Iniciando seed de la base de datos...');

  const clientRepository = dataSource.getRepository(Client);
  const preferencesRepository = dataSource.getRepository(ClientPreferences);
  const addressRepository = dataSource.getRepository(ClientAddress);

  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await addressRepository.delete({});
    await preferencesRepository.delete({});
    await clientRepository.delete({});

    // Datos de clientes
    const clientsData = [
      {
        nombre: 'Juan Pérez',
        email: 'juan.perez@email.com',
        telefono: '+34 600 111 111',
      },
      {
        nombre: 'María García',
        email: 'maria.garcia@email.com',
        telefono: '+34 600 222 222',
      },
      {
        nombre: 'Carlos López',
        email: 'carlos.lopez@email.com',
        telefono: '+34 600 333 333',
      },
      {
        nombre: 'Ana Martínez',
        email: 'ana.martinez@email.com',
        telefono: '+34 600 444 444',
      },
      {
        nombre: 'Pedro Sánchez',
        email: 'pedro.sanchez@email.com',
        telefono: '+34 600 555 555',
      },
      {
        nombre: 'Laura Fernández',
        email: 'laura.fernandez@email.com',
        telefono: '+34 600 666 666',
      },
      {
        nombre: 'Miguel Torres',
        email: 'miguel.torres@email.com',
        telefono: '+34 600 777 777',
      },
      {
        nombre: 'Carmen Ruiz',
        email: 'carmen.ruiz@email.com',
        telefono: '+34 600 888 888',
      },
      {
        nombre: 'Roberto Jiménez',
        email: 'roberto.jimenez@email.com',
        telefono: '+34 600 999 999',
      },
      {
        nombre: 'Isabel Moreno',
        email: 'isabel.moreno@email.com',
        telefono: '+34 600 000 000',
      },
      {
        nombre: 'David Herrera',
        email: 'david.herrera@email.com',
        telefono: '+34 601 111 111',
      },
      {
        nombre: 'Elena Vargas',
        email: 'elena.vargas@email.com',
        telefono: '+34 601 222 222',
      },
      {
        nombre: 'Francisco Castro',
        email: 'francisco.castro@email.com',
        telefono: '+34 601 333 333',
      },
      {
        nombre: 'Lucía Ortega',
        email: 'lucia.ortega@email.com',
        telefono: '+34 601 444 444',
      },
      {
        nombre: 'Antonio Ramos',
        email: 'antonio.ramos@email.com',
        telefono: '+34 601 555 555',
      }
    ];

    // Crear clientes
    console.log('👥 Creando clientes...');
    const clients: Client[] = [];
    for (const clientData of clientsData) {
      const client = clientRepository.create({
        ...clientData,
        isDeleted: false,
      });
      const savedClient = await clientRepository.save(client);
      clients.push(savedClient);
    }

    console.log(`✅ ${clients.length} clientes creados exitosamente`);

    // Crear preferencias para cada cliente
    console.log('⚙️ Creando preferencias de clientes...');
    const idiomas = ['es', 'en', 'fr', 'de', 'it'];
    for (const client of clients) {
      const preferences = preferencesRepository.create({
        cliente_id: client.id,
        idioma: idiomas[Math.floor(Math.random() * idiomas.length)],
        notificaciones_email: Math.random() > 0.3,
        notificaciones_push: Math.random() > 0.5,
      });
      await preferencesRepository.save(preferences);
    }

    console.log('✅ Preferencias creadas exitosamente');

    // Datos de direcciones
    const ciudades = [
      { ciudad: 'Madrid', estado: 'Comunidad de Madrid', codigo: '28001' },
      { ciudad: 'Barcelona', estado: 'Cataluña', codigo: '08001' },
      { ciudad: 'Valencia', estado: 'Comunidad Valenciana', codigo: '46001' },
      { ciudad: 'Sevilla', estado: 'Andalucía', codigo: '41001' },
      { ciudad: 'Zaragoza', estado: 'Aragón', codigo: '50001' },
      { ciudad: 'Málaga', estado: 'Andalucía', codigo: '29001' },
      { ciudad: 'Murcia', estado: 'Región de Murcia', codigo: '30001' },
      { ciudad: 'Palma', estado: 'Islas Baleares', codigo: '07001' },
      { ciudad: 'Las Palmas', estado: 'Canarias', codigo: '35001' },
      { ciudad: 'Bilbao', estado: 'País Vasco', codigo: '48001' },
    ];

    const calles = [
      'Calle Gran Vía',
      'Avenida de la Constitución',
      'Plaza Mayor',
      'Calle del Carmen',
      'Paseo de la Castellana',
      'Rambla de Catalunya',
      'Calle de Alcalá',
      'Avenida Diagonal',
      'Calle Sierpes',
      'Plaza del Pilar'
    ];

    const tiposSucursal = [
      'Oficina Principal',
      'Sucursal Centro',
      'Almacén',
      'Tienda',
      'Oficina Comercial',
      'Centro de Distribución',
      'Showroom',
      'Taller',
      'Sede Administrativa'
    ];

    // Crear direcciones para cada cliente (1-3 direcciones por cliente)
    console.log('🏠 Creando direcciones de clientes...');
    for (const client of clients) {
      const numDirecciones = Math.floor(Math.random() * 3) + 1; // 1 a 3 direcciones
      
      for (let i = 0; i < numDirecciones; i++) {
        const ciudadInfo = ciudades[Math.floor(Math.random() * ciudades.length)];
        const calle = calles[Math.floor(Math.random() * calles.length)];
        const numero = Math.floor(Math.random() * 200) + 1;
        
        const address = addressRepository.create({
          cliente_id: client.id,
          nombre_sucursal: i === 0 ? 'Oficina Principal' : tiposSucursal[Math.floor(Math.random() * tiposSucursal.length)],
          calle: `${calle}, ${numero}`,
          ciudad: ciudadInfo.ciudad,
          estado_provincia: ciudadInfo.estado,
          codigo_postal: ciudadInfo.codigo,
          pais: 'España',
          es_principal: i === 0, // La primera dirección siempre es principal
          is_deleted: false
        });
        
        await addressRepository.save(address);
      }
    }

    console.log('✅ Direcciones creadas exitosamente');

    // Mostrar estadísticas
    const totalClients = await clientRepository.count();
    const totalPreferences = await preferencesRepository.count();
    const totalAddresses = await addressRepository.count();

    console.log('📊 Estadísticas del seed:');
    console.log(`   - Clientes: ${totalClients}`);
    console.log(`   - Preferencias: ${totalPreferences}`);
    console.log(`   - Direcciones: ${totalAddresses}`);
    console.log('🎉 Seed completado exitosamente!');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

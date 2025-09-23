// Script de prueba para verificar las nuevas entidades
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3000/graphql');

async function testQueries() {
  console.log('🧪 Iniciando pruebas de las queries...\n');

  try {
    // 1. Consultar todos los clientes con sus direcciones
    console.log('1️⃣ Consultando clientes con direcciones:');
    const clientsQuery = `
      query GetClients {
        clients {
          id
          nombre
          email
          telefono
          addresses {
            id
            nombre_sucursal
            calle
            ciudad
            estado_provincia
            es_principal
          }
        }
      }
    `;

    const clientsResult = await client.request(clientsQuery);
    console.log(`   ✅ ${clientsResult.clients.length} clientes encontrados`);
    if (clientsResult.clients.length > 0) {
      const firstClient = clientsResult.clients[0];
      console.log(`   📍 Cliente ejemplo: ${firstClient.nombre} tiene ${firstClient.addresses.length} direcciones`);
    }

    // 2. Consultar todas las direcciones
    console.log('\n2️⃣ Consultando todas las direcciones:');
    const addressesQuery = `
      query GetAddresses {
        clientAddresses {
          id
          nombre_sucursal
          calle
          ciudad
          estado_provincia
          es_principal
          client {
            nombre
          }
        }
      }
    `;

    const addressesResult = await client.request(addressesQuery);
    console.log(`   ✅ ${addressesResult.clientAddresses.length} direcciones encontradas`);

    // 3. Consultar direcciones por cliente específico
    if (clientsResult.clients.length > 0) {
      const clientId = clientsResult.clients[0].id;
      console.log(`\n3️⃣ Consultando direcciones del cliente ${clientId}:`);
      
      const clientAddressesQuery = `
        query GetClientAddresses($clientId: Int!) {
          clientAddressesByClient(clientId: $clientId) {
            id
            nombre_sucursal
            calle
            ciudad
            es_principal
          }
        }
      `;

      const clientAddressesResult = await client.request(clientAddressesQuery, { clientId });
      console.log(`   ✅ ${clientAddressesResult.clientAddressesByClient.length} direcciones del cliente ${clientId}`);
    }

    console.log('\n🎉 Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

testQueries();

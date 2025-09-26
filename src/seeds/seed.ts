import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ClientSeedService } from './client.seed';
import { ClientPreferencesSeedService } from './client-preferences.seed';
import { AuthSeedService } from './auth.seed';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('🌱 Iniciando proceso de seeding...');
    
    // Primero verificar conexión con el servicio de auth
    const authSeedService = app.get(AuthSeedService);
    
    console.log('🔍 Verificando conexión con servicio de autenticación...');
    await authSeedService.validateAuthConnection();
    
    // Crear usuarios de prueba
    console.log('👥 Creando usuarios de prueba...');
    const authResult = await authSeedService.seedUsers();
    console.log('📋 Usuarios procesados:', authResult.users.length);
    
    // Ejecutar seeds de clientes
    const clientSeedService = app.get(ClientSeedService);
    const clientPreferencesSeedService = app.get(ClientPreferencesSeedService);

    console.log('👤 Creando clientes de prueba...');
    await clientSeedService.seed();
    
    console.log('⚙️ Creando preferencias de clientes...');
    await clientPreferencesSeedService.seed();

    console.log('✅ Seeding completado exitosamente');
    console.log('\n📊 Resumen de usuarios creados:');
    authResult.users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.userName}`);
    });
    
  } catch (error) {
    console.error('❌ Error durante el seeding:', error.message);
    console.error('\n💡 Sugerencias:');
    console.error('  1. Asegúrate de que el servicio de autenticación esté ejecutándose');
    console.error('  2. Verifica que la URL en GRPC_AUTH_URL sea correcta');
    console.error('  3. Revisa que el puerto 3003 esté disponible');
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('💥 Error fatal durante el seeding:', error);
  process.exit(1);
});
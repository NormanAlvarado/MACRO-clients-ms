import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ClientSeed } from './client.seed';

async function runSeeds() {
  console.log('🌱 Iniciando proceso de seed...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    // Leer argumentos de línea de comandos
    const force = process.argv.includes('--force');
    
    // Ejecutar seed de clientes
    const clientSeed = app.get(ClientSeed);
    await clientSeed.run(force);
    
    console.log('🎉 Proceso de seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el proceso de seed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeeds();

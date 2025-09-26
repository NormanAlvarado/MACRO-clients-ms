import { Injectable, Inject, Logger } from '@nestjs/common';
import * as microservices from '@nestjs/microservices';
import { envs } from '../config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthSeedService {
  private readonly logger = new Logger(AuthSeedService.name);

  constructor(
    @Inject(envs.grpcAuthService)
    private readonly authClient: microservices.ClientGrpc,
  ) {}

  async seedUsers() {
    try {
      this.logger.log('🌱 Iniciando creación de usuarios de prueba...');

      // Definir usuarios por defecto para cada rol
      const seedUsers = [
        {
          email: 'master@macro.com',
          userName: 'Master Admin',
          password: 'MasterPassword123!',
          role: 'MASTER',
        },
        {
          email: 'moderator@macro.com',
          userName: 'Moderator User',
          password: 'ModeratorPassword123!',
          role: 'MODERATOR',
        },
        {
          email: 'colaborator@macro.com',
          userName: 'Colaborator User',
          password: 'ColaboratorPassword123!',
          role: 'COLABORATOR',
        },
        {
          email: 'basic@macro.com',
          userName: 'Basic User',
          password: 'BasicPassword123!',
          role: 'BASIC',
        },
      ];

      const userService = this.authClient.getService('UserService');

      for (const userData of seedUsers) {
        try {
          // Intentar crear cada usuario
          const result = await firstValueFrom(
            userService['CreateUser'](userData)
          );

          this.logger.log(`✅ Usuario creado: ${userData.email} con rol ${userData.role}`);
        } catch (error) {
          // Si el usuario ya existe, no es un error crítico
          if (error?.message?.includes('already exists') || error?.code === 6) {
            this.logger.warn(`⚠️ Usuario ${userData.email} ya existe, omitiendo...`);
          } else {
            this.logger.error(`❌ Error creando usuario ${userData.email}:`, error.message);
          }
        }
      }

      this.logger.log('✨ Proceso de creación de usuarios completado');

      // Retornar información sobre los usuarios creados
      return {
        message: 'Usuarios de prueba procesados',
        users: seedUsers.map(u => ({
          email: u.email,
          role: u.role,
          userName: u.userName,
        })),
      };

    } catch (error) {
      this.logger.error('💥 Error general en el seeding de usuarios:', error);
      throw new Error(`Error en AuthSeedService: ${error.message}`);
    }
  }

  async validateAuthConnection() {
    try {
      const healthService = this.authClient.getService('HealthService');
      const result = await firstValueFrom(
        healthService['HealthCheck']({})
      );
      
      this.logger.log('🟢 Conexión con el servicio de auth verificada');
      return result;
    } catch (error) {
      this.logger.error('🔴 Error conectando con el servicio de auth:', error.message);
      throw new Error('No se pudo conectar con el servicio de autenticación. Asegúrate de que esté ejecutándose en ' + envs.grpcAuthUrl);
    }
  }
}

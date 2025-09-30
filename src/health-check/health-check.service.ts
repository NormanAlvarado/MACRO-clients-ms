import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { 
  DbHealth, 
  HealthStatus, 
  ServiceHealth, 
  HealthStatusEnum, 
  DbStatusEnum 
} from './dto/health-check.types';

@Injectable()
export class HealthCheckService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) {}

  async checkTypeORM(): Promise<DbHealth> {
    try {
      // Ejecutar una query simple para verificar la conexión
      await this.dataSource.query('SELECT 1');
      return { 
        dbStatus: DbStatusEnum.UP, 
        message: 'Base de datos ok' 
      };
    } catch (err) {
      return { 
        dbStatus: DbStatusEnum.DOWN, 
        message: err.message 
      };
    }
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const dbHealth = await this.checkTypeORM();
    
    const services: ServiceHealth = {
      database: dbHealth
    };
    
    return {
      status: dbHealth.dbStatus === DbStatusEnum.UP ? HealthStatusEnum.OK : HealthStatusEnum.ERROR,
      timestamp: new Date().toISOString(),
      services
    };
  }
}

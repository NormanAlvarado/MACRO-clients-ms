import { Resolver, Query } from '@nestjs/graphql';
import { HealthCheckService } from './health-check.service';
import { HealthStatus, DbHealth } from './dto/health-check.types';

@Resolver()
export class HealthCheckResolver {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Query(() => HealthStatus, { name: 'healthCheck' })
  async checkHealth(): Promise<HealthStatus> {
    return await this.healthCheckService.getHealthStatus();
  }

  @Query(() => DbHealth, { name: 'databaseHealth' })
  async checkDatabase(): Promise<DbHealth> {
    return await this.healthCheckService.checkTypeORM();
  }
}

import { Module } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { HealthCheckResolver } from './health-check.controller';

@Module({
  providers: [HealthCheckService, HealthCheckResolver],
})
export class HealthCheckModule {}

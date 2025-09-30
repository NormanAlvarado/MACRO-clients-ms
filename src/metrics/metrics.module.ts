import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  providers: [MetricsService],
  imports: [PrometheusModule.register()],
  exports: [MetricsService],
})
export class MetricsModule {}

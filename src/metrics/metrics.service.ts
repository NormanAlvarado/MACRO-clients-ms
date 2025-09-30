import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Gauge, register } from 'prom-client';

@Injectable()
export class MetricsService {
  // Contadores para operaciones de clientes
  public readonly clientOperationsCounter: Counter<string>;
  public readonly clientQueriesCounter: Counter<string>;
  public readonly databaseErrorsCounter: Counter<string>;

  // Histogramas para medir tiempos de respuesta
  public readonly clientOperationDuration: Histogram<string>;
  public readonly databaseQueryDuration: Histogram<string>;

  // Gauges para métricas en tiempo real
  public readonly activeClientsGauge: Gauge<string>;
  public readonly deletedClientsGauge: Gauge<string>;
  public readonly clientAddressesGauge: Gauge<string>;
  public readonly databaseConnectionsGauge: Gauge<string>;

  constructor() {
    // Cliente Operations Counter
    const existingClientOps = register.getSingleMetric('client_operations_total');
    if (existingClientOps) {
      this.clientOperationsCounter = existingClientOps as Counter<string>;
    } else {
      this.clientOperationsCounter = new Counter({
        name: 'client_operations_total',
        help: 'Total de operaciones realizadas en clientes',
        labelNames: ['operation', 'status', 'user_role'],
      });
    }

    // Client Queries Counter
    const existingClientQueries = register.getSingleMetric('client_queries_total');
    if (existingClientQueries) {
      this.clientQueriesCounter = existingClientQueries as Counter<string>;
    } else {
      this.clientQueriesCounter = new Counter({
        name: 'client_queries_total',
        help: 'Total de consultas realizadas a la entidad cliente',
        labelNames: ['query_type', 'table', 'status'],
      });
    }

    // Database Errors Counter
    const existingDbErrors = register.getSingleMetric('client_database_errors_total');
    if (existingDbErrors) {
      this.databaseErrorsCounter = existingDbErrors as Counter<string>;
    } else {
      this.databaseErrorsCounter = new Counter({
        name: 'client_database_errors_total',
        help: 'Total de errores de base de datos en operaciones de clientes',
        labelNames: ['operation', 'error_type'],
      });
    }

    // Client Operation Duration Histogram
    const existingOpsDuration = register.getSingleMetric('client_operation_duration_seconds');
    if (existingOpsDuration) {
      this.clientOperationDuration = existingOpsDuration as Histogram<string>;
    } else {
      this.clientOperationDuration = new Histogram({
        name: 'client_operation_duration_seconds',
        help: 'Duración de las operaciones de clientes en segundos',
        labelNames: ['operation', 'status'],
        buckets: [0.1, 0.5, 1, 2, 5, 10],
      });
    }

    // Database Query Duration Histogram
    const existingQueryDuration = register.getSingleMetric('client_database_query_duration_seconds');
    if (existingQueryDuration) {
      this.databaseQueryDuration = existingQueryDuration as Histogram<string>;
    } else {
      this.databaseQueryDuration = new Histogram({
        name: 'client_database_query_duration_seconds',
        help: 'Duración de las consultas a la base de datos en segundos',
        labelNames: ['query_type', 'table'],
        buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1],
      });
    }

    // Active Clients Gauge
    const existingActiveClients = register.getSingleMetric('client_active_total');
    if (existingActiveClients) {
      this.activeClientsGauge = existingActiveClients as Gauge<string>;
    } else {
      this.activeClientsGauge = new Gauge({
        name: 'client_active_total',
        help: 'Número total de clientes activos (no eliminados)',
      });
    }

    // Deleted Clients Gauge
    const existingDeletedClients = register.getSingleMetric('client_deleted_total');
    if (existingDeletedClients) {
      this.deletedClientsGauge = existingDeletedClients as Gauge<string>;
    } else {
      this.deletedClientsGauge = new Gauge({
        name: 'client_deleted_total',
        help: 'Número total de clientes eliminados (soft delete)',
      });
    }

    // Client Addresses Gauge
    const existingClientAddresses = register.getSingleMetric('client_addresses_total');
    if (existingClientAddresses) {
      this.clientAddressesGauge = existingClientAddresses as Gauge<string>;
    } else {
      this.clientAddressesGauge = new Gauge({
        name: 'client_addresses_total',
        help: 'Número total de direcciones de clientes registradas',
      });
    }

    // Database Connections Gauge
    const existingDbConnections = register.getSingleMetric('client_database_connections_active');
    if (existingDbConnections) {
      this.databaseConnectionsGauge = existingDbConnections as Gauge<string>;
    } else {
      this.databaseConnectionsGauge = new Gauge({
        name: 'client_database_connections_active',
        help: 'Número de conexiones activas a la base de datos',
      });
    }
  }

  // Métodos para incrementar contadores
  incrementClientOperation(operation: string, status: 'success' | 'error', userRole: string) {
    this.clientOperationsCounter.inc({ operation, status, user_role: userRole });
  }

  incrementClientQuery(queryType: string, table: string, status: 'success' | 'error') {
    this.clientQueriesCounter.inc({ query_type: queryType, table, status });
  }

  incrementDatabaseError(operation: string, errorType: string) {
    this.databaseErrorsCounter.inc({ operation, error_type: errorType });
  }

  // Métodos para medir duración
  measureClientOperationDuration(operation: string, status: 'success' | 'error') {
    return this.clientOperationDuration.labels(operation, status);
  }

  measureDatabaseQueryDuration(queryType: string, table: string) {
    return this.databaseQueryDuration.labels(queryType, table);
  }

  // Métodos para actualizar gauges
  setActiveClientsCount(count: number) {
    this.activeClientsGauge.set(count);
  }

  setDeletedClientsCount(count: number) {
    this.deletedClientsGauge.set(count);
  }

  setClientAddressesCount(count: number) {
    this.clientAddressesGauge.set(count);
  }

  setDatabaseConnectionsCount(count: number) {
    this.databaseConnectionsGauge.set(count);
  }

  // Método helper para medir tiempo de ejecución
  async measureExecutionTime<T>(
    operation: () => Promise<T>,
    histogram: any,
    labels?: Record<string, string>
  ): Promise<T> {
    const end = histogram.startTimer(labels);
    try {
      const result = await operation();
      end();
      return result;
    } catch (error) {
      end();
      throw error;
    }
  }
}

# Métricas del Microservicio de Clientes

## Descripción

Este microservicio implementa un sistema completo de métricas usando **Prometheus** para monitorear el rendimiento, errores y uso de la aplicación.

## Endpoint de Métricas

```
GET /metrics
```

Retorna las métricas en formato Prometheus que pueden ser consumidas por herramientas de monitoreo.

## Métricas Implementadas

### 1. **Contadores (Counters)**

#### `client_operations_total`
- **Descripción**: Total de operaciones realizadas en clientes
- **Labels**: 
  - `operation`: create, findAll, findOne, update, remove, restore
  - `status`: success, error
  - `user_role`: BASIC, COLABORATOR, MODERATOR, MASTER, unknown

#### `client_queries_total`
- **Descripción**: Total de consultas realizadas a la entidad cliente
- **Labels**: 
  - `query_type`: select, insert, update, delete
  - `table`: clientes, preferencias_cliente, direcciones_cliente
  - `status`: success, error

#### `client_database_errors_total`
- **Descripción**: Total de errores de base de datos
- **Labels**: 
  - `operation`: create, findAll, update, remove, etc.
  - `error_type`: Nombre de la clase del error

### 2. **Histogramas (Histograms)**

#### `client_operation_duration_seconds`
- **Descripción**: Duración de las operaciones de clientes en segundos
- **Labels**: 
  - `operation`: Tipo de operación
  - `status`: success, error
- **Buckets**: [0.1, 0.5, 1, 2, 5, 10]

#### `client_database_query_duration_seconds`
- **Descripción**: Duración de las consultas a la base de datos
- **Labels**: 
  - `query_type`: select, insert, update, delete
  - `table`: Nombre de la tabla
- **Buckets**: [0.01, 0.05, 0.1, 0.25, 0.5, 1]

### 3. **Gauges (Medidores)**

#### `client_active_total`
- **Descripción**: Número total de clientes activos (no eliminados)
- **Actualización**: Se actualiza automáticamente después de crear/eliminar clientes

#### `client_deleted_total`
- **Descripción**: Número total de clientes eliminados (soft delete)
- **Actualización**: Se actualiza automáticamente después de eliminar/restaurar clientes

#### `client_addresses_total`
- **Descripción**: Número total de direcciones de clientes registradas
- **Actualización**: Puede ser actualizada cuando se gestionan direcciones

#### `client_database_connections_active`
- **Descripción**: Número de conexiones activas a la base de datos
- **Actualización**: Puede ser actualizada manualmente

## Ejemplo de Uso de Métricas

### Consultas PromQL Útiles

```promql
# Tasa de operaciones exitosas vs errores por minuto
rate(client_operations_total[1m])

# Tasa de consultas a la base de datos por minuto
rate(client_queries_total[1m])

# Percentil 95 del tiempo de respuesta
histogram_quantile(0.95, client_operation_duration_seconds_bucket)

# Total de clientes creados por hora
increase(client_operations_total{operation="create",status="success"}[1h])

# Clientes activos en tiempo real
client_active_total

# Clientes eliminados (soft delete)
client_deleted_total

# Distribución de clientes por estado
client_active_total / (client_active_total + client_deleted_total)

# Tasa de errores de base de datos
rate(client_database_errors_total[5m])
```

### Dashboard de Grafana

Métricas recomendadas para dashboards:

1. **Panel de Operaciones**:
   - Gráfico de líneas: `rate(client_operations_total[1m])` por operación
   - Gauge: Clientes activos vs eliminados
   - Gráfico de barras: Operaciones por rol de usuario

2. **Panel de Performance**:
   - Heatmap: Distribución de tiempos de respuesta
   - Gráfico: Percentiles de duración de operaciones

3. **Panel de Errores**:
   - Contador: Total de errores por operación
   - Gráfico de barras: Errores de base de datos por tipo

4. **Panel de Base de Datos**:
   - Conexiones activas
   - Duración promedio de queries
   - Errores de DB por tipo

## Integración con el Código

### Automática
Las métricas se capturan automáticamente en:
- ✅ **ClientService**: Todas las operaciones CRUD
- ✅ **Manejo de Errores**: Errores de base de datos por tipo
- ✅ **Contadores de Clientes Activos**: Actualizados en crear/eliminar

### Manual
Para métricas personalizadas, inyectar `MetricsService`:

```typescript
constructor(private readonly metricsService: MetricsService) {}

// Incrementar contador
this.metricsService.incrementClientOperation('customOp', 'success', 'ADMIN');

// Medir duración
const timer = this.metricsService.measureClientOperationDuration('operation', 'success');
const end = timer.startTimer();
// ... operación ...
end();

// Actualizar gauge
this.metricsService.setActiveClientsCount(count);
```

## Configuración para Producción

### Docker Compose
```yaml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Prometheus Config
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'macro-clients-ms'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
```

## Beneficios de Monitoreo

- **Detección temprana** de problemas de rendimiento
- **Análisis de patrones** de uso por rol de usuario
- **Alertas automáticas** en caso de errores críticos
- **Optimización** basada en métricas reales
- **SLA Monitoring** para cumplimiento de objetivos
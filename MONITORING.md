# 📊 Stack de Monitoreo MACRO Clients

## Descripción

Este stack incluye **Prometheus**, **Grafana** y **PostgreSQL** configurados para monitorear el microservicio de clientes MACRO.

## 🚀 Inicio Rápido

### 1. Detener contenedores existentes

Si tienes contenedores de Grafana y Prometheus ejecutándose por separado, deténlos primero:

```bash
# Detener contenedores individuales
docker stop grafana prometheus

# O si usas docker-compose en otro directorio
docker-compose down
```

### 2. Iniciar el stack completo

```bash
# Usando el script helper
./monitoring.sh start

# O directamente con docker-compose
docker-compose -f docker-compose.monitoring.yml up -d
```

### 3. Verificar que todo esté funcionando

```bash
./monitoring.sh status
```

## 🌐 Acceso a los Servicios

Una vez iniciado el stack:

- **📊 Grafana**: http://localhost:3001
  - Usuario: `admin`
  - Contraseña: `admin`

- **🔍 Prometheus**: http://localhost:9090

- **🐘 PostgreSQL**: `localhost:5433`
  - Database: `macro-clients-db`
  - Usuario: `postgres`
  - Contraseña: `postgres`

## 📈 Dashboard Pre-configurado

El dashboard de Grafana incluye:

1. **Operaciones de Clientes por Minuto**: Tasa de operaciones CRUD
2. **Clientes Activos vs Eliminados**: Métricas de negocio
3. **Consultas a Base de Datos**: Performance de queries
4. **Duración de Operaciones (P95)**: Tiempos de respuesta
5. **Errores de Base de Datos**: Monitoreo de errores

## 🔧 Configuración de Red

**Problema resuelto**: Los servicios ahora están en la misma red Docker (`macro-network`), permitiendo que Grafana se conecte a Prometheus usando el nombre del servicio:

```yaml
# En Grafana datasource
url: http://prometheus:9090  # ✅ Funciona
# En lugar de
url: http://localhost:9090   # ❌ No funciona entre contenedores
```

## 📋 Comandos Útiles

```bash
# Iniciar stack
./monitoring.sh start

# Ver logs en tiempo real
./monitoring.sh logs

# Detener stack
./monitoring.sh stop

# Reiniciar stack
./monitoring.sh restart

# Ver estado
./monitoring.sh status

# Limpiar todo (incluye volúmenes)
./monitoring.sh clean
```

## 🔍 Verificar Métricas

1. **Iniciar el microservicio**:
   ```bash
   npm run start:dev
   ```

2. **Generar tráfico**:
   - Ve a http://localhost:3000/graphql
   - Ejecuta algunas queries como `{ clients { id nombre } }`

3. **Ver métricas en Prometheus**:
   - Ve a http://localhost:9090
   - Busca métricas como `client_operations_total`

4. **Ver dashboard en Grafana**:
   - Ve a http://localhost:3001
   - El dashboard se carga automáticamente

## 🏗️ Estructura de Archivos

```
monitoring/
├── prometheus.yml              # Configuración de Prometheus
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── prometheus.yml  # Datasource automático
│   │   └── dashboards/
│   │       └── dashboards.yml  # Configuración de dashboards
│   └── dashboards/
│       └── clients-dashboard.json  # Dashboard principal
```

## 🔗 Métricas Disponibles

El microservicio expone métricas en `/metrics`:

```bash
curl http://localhost:3000/metrics
```

### Métricas Principales:

- `client_operations_total` - Operaciones CRUD
- `client_queries_total` - Consultas a BD
- `client_operation_duration_seconds` - Duración de operaciones
- `client_active_total` - Clientes activos
- `client_deleted_total` - Clientes eliminados

## 🐛 Solución de Problemas

### Grafana no puede conectar a Prometheus

✅ **Solucionado**: Los servicios ahora están en la misma red Docker.

### Puerto ya en uso

```bash
# Verificar qué usa el puerto
netstat -tulpn | grep :9090
netstat -tulpn | grep :3001

# Detener servicios conflictivos
docker stop <container-id>
```

### Limpiar todo y empezar de nuevo

```bash
./monitoring.sh clean
./monitoring.sh start
```

## 📊 Queries PromQL Útiles

```promql
# Tasa de operaciones por minuto
rate(client_operations_total[1m])

# Percentil 95 de duración
histogram_quantile(0.95, client_operation_duration_seconds_bucket)

# Errores por minuto
rate(client_database_errors_total[1m])

# Clientes activos
client_active_total
```
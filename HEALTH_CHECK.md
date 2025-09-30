# Health Check - Documentación GraphQL

## Descripción

El módulo de Health Check proporciona queries GraphQL para verificar el estado de la aplicación y sus servicios dependientes.

## Queries Disponibles

### 1. Health Check General
```graphql
query {
  healthCheck {
    status
    timestamp
    services {
      database {
        dbStatus
        message
      }
    }
  }
}
```

**Respuesta exitosa:**
```json
{
  "data": {
    "healthCheck": {
      "status": "OK",
      "timestamp": "2025-09-29T20:45:00.000Z",
      "services": {
        "database": {
          "dbStatus": "UP",
          "message": "Base de datos ok"
        }
      }
    }
  }
}
```

**Respuesta con error:**
```json
{
  "data": {
    "healthCheck": {
      "status": "ERROR",
      "timestamp": "2025-09-29T20:45:00.000Z",
      "services": {
        "database": {
          "dbStatus": "DOWN",
          "message": "Error de conexión a la base de datos"
        }
      }
    }
  }
}
```

### 2. Health Check de Base de Datos
```graphql
query {
  databaseHealth {
    dbStatus
    message
  }
}
```

**Respuesta exitosa:**
```json
{
  "data": {
    "databaseHealth": {
      "dbStatus": "UP",
      "message": "Base de datos ok"
    }
  }
}
```

**Respuesta con error:**
```json
{
  "data": {
    "databaseHealth": {
      "dbStatus": "DOWN",
      "message": "Error de conexión a la base de datos"
    }
  }
}
```

## Implementación Técnica

### TypeORM Health Check

El health check utiliza `DataSource.query('SELECT 1')` para verificar la conectividad con PostgreSQL:

```typescript
async checkTypeORM(): Promise<DbHealth> {
  try {
    // Ejecutar una query simple para verificar la conexión
    await this.dataSource.query('SELECT 1');
    return { 
      dbStatus: 'up', 
      message: 'Base de datos ok' 
    };
  } catch (err) {
    return { 
      dbStatus: 'down', 
      message: err.message 
    };
  }
}
```

### Características

- **No requiere entidades**: Utiliza `@InjectDataSource()` para acceder directamente al DataSource
- **Query mínima**: Ejecuta `SELECT 1` que es eficiente y no afecta el rendimiento
- **Manejo de errores**: Captura y retorna errores de conexión de forma segura
- **Estructura consistente**: Respuestas estandarizadas para integración con herramientas de monitoreo

## Esquema GraphQL

### Tipos Disponibles

```graphql
enum HealthStatusEnum {
  OK
  ERROR
}

enum DbStatusEnum {
  UP
  DOWN
}

type DbHealth {
  dbStatus: DbStatusEnum!
  message: String!
}

type ServiceHealth {
  database: DbHealth!
}

type HealthStatus {
  status: HealthStatusEnum!
  timestamp: String!
  services: ServiceHealth!
}
```

### Queries

```graphql
type Query {
  healthCheck: HealthStatus!
  databaseHealth: DbHealth!
}
```

## Uso en Monitoreo

Estas queries GraphQL pueden ser utilizadas por:

- **Aplicaciones frontend** para mostrar estado del sistema
- **Dashboards de administración** 
- **Herramientas de monitoreo** que soportan GraphQL
- **Scripts de verificación** automatizados
- **Sistemas de alertas** personalizados

### Ejemplo con curl
```bash
# Health Check General
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ healthCheck { status timestamp services { database { dbStatus message } } } }"}'

# Health Check de Base de Datos
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ databaseHealth { dbStatus message } }"}'
```
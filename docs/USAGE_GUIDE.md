# 🚀 Guía de Uso - MACRO Clients Microservice

> 📖 Guía completa paso a paso para equipos de desarrollo que utilizarán el microservicio de clientes

## 📋 Tabla de Contenidos

- [🎯 Para Quién es Esta Guía](#-para-quién-es-esta-guía)
- [⚡ Setup Inicial](#-setup-inicial)
- [🔧 Configuración por Entorno](#-configuración-por-entorno)
- [💻 Integración Frontend](#-integración-frontend)
- [🌐 Casos de Uso Comunes](#-casos-de-uso-comunes)
- [🚀 Deployment](#-deployment)
- [📊 Monitoreo en Producción](#-monitoreo-en-producción)
- [🐛 Debugging](#-debugging)

## 🎯 Para Quién es Esta Guía

Esta documentación está dirigida a:

- 👨‍💻 **Desarrolladores Frontend** que consuman la API GraphQL
- 🔧 **Desarrolladores Backend** que integren con otros servicios
- 🏗️ **DevOps Engineers** que deplieguen y mantengan el servicio
- 🧪 **QA Engineers** que prueben las funcionalidades
- 📊 **Product Managers** que necesiten entender las capacidades

---

## ⚡ Setup Inicial

### 🔍 Pre-requisitos Verificados

Antes de comenzar, verifica que tengas instalado:

```bash
# Verificar Node.js (versión 18+)
node --version
# Debería mostrar: v18.x.x o superior

# Verificar npm
npm --version
# Debería mostrar: 8.x.x o superior

# Verificar Docker
docker --version
# Debería mostrar: Docker version 20.x.x o superior

# Verificar Docker Compose
docker-compose --version
# Debería mostrar: docker-compose version 1.29.x o superior
```

### 📦 Instalación Paso a Paso

#### 1. **Clonar y Configurar el Proyecto**

```bash
# Clonar el repositorio
git clone https://github.com/NormanAlvarado/MACRO-clients-ms.git
cd MACRO-clients-ms

# Instalar dependencias
npm install

# Verificar que la instalación fue exitosa
npm run build
```

#### 2. **Configurar Variables de Entorno**

```bash
# Crear archivo de configuración
cp .env.example .env

# Editar con tus valores
nano .env
```

**Configuración mínima requerida:**
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=macro_user
DB_PASSWORD=secure_password_123
DB_NAME=macro_clients_db

# Aplicación
NODE_ENV=development
PORT=3000

# gRPC Auth Service
AUTH_SERVICE_URL=localhost:50051

# Monitoreo (opcional para desarrollo)
PROMETHEUS_ENABLED=true
```

#### 3. **Configurar Base de Datos**

**Opción A: Docker (Recomendado para desarrollo)**
```bash
# Levantar solo PostgreSQL
docker-compose up -d postgres

# Verificar que está corriendo
docker-compose ps
```

**Opción B: PostgreSQL Local**
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos y usuario
CREATE DATABASE macro_clients_db;
CREATE USER macro_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE macro_clients_db TO macro_user;
\q
```

#### 4. **Inicializar y Poblar la Base de Datos**

```bash
# Iniciar el servidor (primera vez para crear tablas)
npm run start:dev

# En otra terminal, ejecutar seeds de datos de prueba
curl -X POST http://localhost:3000/seeds

# Verificar que los datos se crearon
curl -s -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ clients(pagination: {limit: 5}) { totalCount items { id nombre email } } }"}' | jq .
```

---

## 🔧 Configuración por Entorno

### 🏠 Desarrollo Local

**Características:**
- ✅ Hot reload activado
- ✅ Logging detallado
- ✅ GraphQL Playground habilitado
- ✅ Sincronización automática de DB
- ✅ Seeds de datos disponibles

```bash
# Iniciar en modo desarrollo
npm run start:dev

# El servidor estará disponible en:
# http://localhost:3000 - API
# http://localhost:3000/graphql - GraphQL Playground
```

**Variables específicas para desarrollo:**
```env
NODE_ENV=development
LOG_LEVEL=debug
DB_SYNCHRONIZE=true
GRAPHQL_PLAYGROUND=true
```

### 🧪 Testing/Staging

**Características:**
- ✅ Environment similar a producción
- ✅ Logging moderado
- ✅ Base de datos separada
- ✅ Metrics habilitadas

```bash
# Build para testing
npm run build

# Iniciar en modo staging
npm run start:prod
```

**Variables para staging:**
```env
NODE_ENV=staging
LOG_LEVEL=info
DB_SYNCHRONIZE=false
DB_SSL=true
GRAPHQL_PLAYGROUND=false
PROMETHEUS_ENABLED=true
```

### 🚀 Producción

**Características:**
- ✅ Build optimizado
- ✅ Logging mínimo (errores)
- ✅ SSL habilitado
- ✅ Monitoreo completo
- ✅ Health checks

```bash
# Build para producción
npm run build

# Iniciar con PM2 (recomendado)
pm2 start ecosystem.config.js
```

**Variables para producción:**
```env
NODE_ENV=production
LOG_LEVEL=error
DB_SSL=true
DB_SYNCHRONIZE=false
PROMETHEUS_ENABLED=true
HEALTH_CHECK_ENABLED=true
```

---

## 💻 Integración Frontend

### 🔌 Conectar desde React/Vue/Angular

#### **Configuración con Apollo Client (React)**

```typescript
// apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Obtener token del almacenamiento local
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
```

#### **Hook personalizado para clientes**

```typescript
// hooks/useClients.ts
import { useQuery, useMutation } from '@apollo/client';
import { GET_CLIENTS, CREATE_CLIENT, UPDATE_CLIENT } from '../graphql/queries';

export const useClients = (pagination = { page: 1, limit: 10 }) => {
  const { data, loading, error, refetch } = useQuery(GET_CLIENTS, {
    variables: { pagination },
    errorPolicy: 'all'
  });

  const [createClient] = useMutation(CREATE_CLIENT, {
    refetchQueries: [{ query: GET_CLIENTS, variables: { pagination } }]
  });

  const [updateClient] = useMutation(UPDATE_CLIENT);

  return {
    clients: data?.clients?.items || [],
    totalCount: data?.clients?.totalCount || 0,
    loading,
    error,
    createClient,
    updateClient,
    refetch
  };
};
```

#### **Queries GraphQL**

```typescript
// graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_CLIENTS = gql`
  query GetClients($pagination: PaginationInput) {
    clients(pagination: $pagination) {
      items {
        id
        nombre
        email
        telefono
        estado
        createdAt
        direcciones {
          id
          direccion
          ciudad
          esPrincipal
        }
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(createClientInput: $input) {
      id
      nombre
      email
      telefono
      estado
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: String!, $input: UpdateClientInput!) {
    updateClient(id: $id, updateClientInput: $input) {
      id
      nombre
      email
      telefono
      updatedAt
    }
  }
`;
```

#### **Componente de ejemplo**

```tsx
// components/ClientList.tsx
import React from 'react';
import { useClients } from '../hooks/useClients';

const ClientList: React.FC = () => {
  const { clients, loading, error, createClient } = useClients();

  const handleCreateClient = async (clientData: any) => {
    try {
      await createClient({
        variables: {
          input: clientData
        }
      });
      alert('Cliente creado exitosamente');
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Error al crear cliente');
    }
  };

  if (loading) return <div>Cargando clientes...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Lista de Clientes</h2>
      {clients.map(client => (
        <div key={client.id} className="client-card">
          <h3>{client.nombre}</h3>
          <p>Email: {client.email}</p>
          <p>Estado: {client.estado}</p>
          {client.direcciones.length > 0 && (
            <p>Ciudad: {client.direcciones[0].ciudad}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClientList;
```

### 🔗 Integración desde Backend (Node.js/Express)

```typescript
// services/clientService.ts
import axios from 'axios';

class ClientService {
  private graphqlUrl = 'http://localhost:3000/graphql';
  
  async getClients(pagination = { page: 1, limit: 10 }) {
    const query = `
      query GetClients($pagination: PaginationInput) {
        clients(pagination: $pagination) {
          items {
            id
            nombre
            email
            telefono
          }
          totalCount
        }
      }
    `;

    const response = await axios.post(this.graphqlUrl, {
      query,
      variables: { pagination }
    });

    return response.data.data.clients;
  }

  async createClient(clientData: any) {
    const mutation = `
      mutation CreateClient($input: CreateClientInput!) {
        createClient(createClientInput: $input) {
          id
          nombre
          email
        }
      }
    `;

    const response = await axios.post(this.graphqlUrl, {
      query: mutation,
      variables: { input: clientData }
    });

    return response.data.data.createClient;
  }
}

export default new ClientService();
```

---

## 🌐 Casos de Uso Comunes

### 🎯 1. Registro Completo de Cliente

**Escenario:** Un usuario se registra en la plataforma y necesita crear su perfil completo.

```typescript
// Flujo paso a paso
async function registroCompletoCliente(userData) {
  try {
    // 1. Crear el cliente base
    const cliente = await createClient({
      nombre: userData.nombre,
      email: userData.email,
      telefono: userData.telefono,
      fechaNacimiento: userData.fechaNacimiento
    });

    console.log('✅ Cliente creado:', cliente.id);

    // 2. Agregar dirección principal
    const direccion = await createClientAddress({
      clienteId: cliente.id,
      direccion: userData.direccion,
      ciudad: userData.ciudad,
      estado: userData.estado,
      codigoPostal: userData.codigoPostal,
      pais: userData.pais,
      tipo: 'casa',
      esPrincipal: true
    });

    console.log('✅ Dirección agregada:', direccion.id);

    // 3. Configurar preferencias iniciales
    const preferencias = await createClientPreferences({
      clienteId: cliente.id,
      idioma: userData.idioma || 'es',
      moneda: userData.moneda || 'MXN',
      tema: 'claro',
      notificaciones: true
    });

    console.log('✅ Preferencias configuradas:', preferencias.id);

    return {
      cliente,
      direccion,
      preferencias
    };

  } catch (error) {
    console.error('❌ Error en registro:', error);
    throw error;
  }
}

// Uso del flujo
const nuevoUsuario = {
  nombre: 'Ana María González',
  email: 'ana.gonzalez@example.com',
  telefono: '+52-555-0123',
  fechaNacimiento: '1992-08-15',
  direccion: 'Av. Universidad 456',
  ciudad: 'Guadalajara',
  estado: 'Jalisco',
  codigoPostal: '44100',
  pais: 'México',
  idioma: 'es',
  moneda: 'MXN'
};

registroCompletoCliente(nuevoUsuario);
```

### 🔍 2. Búsqueda y Filtrado Avanzado

**Escenario:** Implementar una búsqueda avanzada con filtros múltiples.

```typescript
// Hook personalizado para búsqueda avanzada
const useAdvancedSearch = () => {
  const [filters, setFilters] = useState({
    nombre: '',
    email: '',
    estado: '',
    ciudad: '',
    pais: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // Query dinámico basado en filtros
  const buildQuery = () => {
    let whereConditions = [];
    
    if (filters.nombre) {
      whereConditions.push(`nombre ILIKE '%${filters.nombre}%'`);
    }
    
    if (filters.email) {
      whereConditions.push(`email ILIKE '%${filters.email}%'`);
    }
    
    if (filters.estado) {
      whereConditions.push(`estado = '${filters.estado}'`);
    }

    // Para filtros de dirección, usar JOIN
    if (filters.ciudad || filters.pais) {
      return `
        query SearchClients($pagination: PaginationInput) {
          clientsWithFilters(
            pagination: $pagination,
            filters: {
              nombre: "${filters.nombre}",
              email: "${filters.email}",
              estado: "${filters.estado}",
              ciudad: "${filters.ciudad}",
              pais: "${filters.pais}"
            }
          ) {
            items {
              id
              nombre
              email
              estado
              direcciones {
                ciudad
                pais
              }
            }
            totalCount
          }
        }
      `;
    }

    return GET_CLIENTS; // Query estándar si no hay filtros complejos
  };

  return { filters, setFilters, buildQuery };
};
```

### 📊 3. Dashboard de Métricas

**Escenario:** Mostrar estadísticas en tiempo real del sistema.

```typescript
// Hook para métricas del dashboard
const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    clientesActivos: 0,
    clientesNuevosHoy: 0,
    clientesPorPais: [],
    loading: true
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // 1. Obtener conteos generales
        const totalQuery = `
          query {
            clientStats {
              total
              activos
              nuevosHoy
              porPais {
                pais
                cantidad
              }
            }
          }
        `;

        const response = await apollo.query({ query: gql(totalQuery) });
        
        setMetrics({
          totalClientes: response.data.clientStats.total,
          clientesActivos: response.data.clientStats.activos,
          clientesNuevosHoy: response.data.clientStats.nuevosHoy,
          clientesPorPais: response.data.clientStats.porPais,
          loading: false
        });

        // 2. Obtener métricas de Prometheus
        const prometheusMetrics = await fetch('http://localhost:3000/metrics');
        const metricsText = await prometheusMetrics.text();
        
        console.log('📊 Métricas Prometheus:', metricsText);

      } catch (error) {
        console.error('Error fetching metrics:', error);
        setMetrics(prev => ({ ...prev, loading: false }));
      }
    };

    fetchMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return metrics;
};
```

### 🔄 4. Sincronización con Servicios Externos

**Escenario:** Mantener datos sincronizados con CRM externo.

```typescript
// Servicio de sincronización
class SyncService {
  async syncWithExternalCRM() {
    console.log('🔄 Iniciando sincronización con CRM externo...');

    try {
      // 1. Obtener clientes modificados en las últimas 24 horas
      const recentClients = await this.getRecentlyModifiedClients();
      
      // 2. Para cada cliente, sincronizar con el CRM
      for (const client of recentClients) {
        await this.syncClientWithCRM(client);
      }

      console.log(`✅ Sincronización completada: ${recentClients.length} clientes`);
      
    } catch (error) {
      console.error('❌ Error en sincronización:', error);
      throw error;
    }
  }

  private async getRecentlyModifiedClients() {
    const query = `
      query GetRecentClients {
        clients(
          pagination: { limit: 1000 }
          filters: { 
            updatedAfter: "${new Date(Date.now() - 24*60*60*1000).toISOString()}" 
          }
        ) {
          items {
            id
            nombre
            email
            telefono
            updatedAt
            direcciones {
              direccion
              ciudad
              pais
            }
          }
        }
      }
    `;

    const response = await apollo.query({ query: gql(query) });
    return response.data.clients.items;
  }

  private async syncClientWithCRM(client) {
    // Enviar datos al CRM externo
    const crmPayload = {
      external_id: client.id,
      name: client.nombre,
      email: client.email,
      phone: client.telefono,
      addresses: client.direcciones,
      last_updated: client.updatedAt
    };

    await fetch('https://external-crm.com/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crmPayload)
    });

    console.log(`✅ Cliente ${client.id} sincronizado con CRM`);
  }
}
```

---

## 🚀 Deployment

### 🐳 Docker Deployment

#### **1. Build de la Imagen**

```dockerfile
# Dockerfile optimizado para producción
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
```

```bash
# Build de la imagen
docker build -t macro-clients-ms:v1.0.0 .

# Subir a registry
docker tag macro-clients-ms:v1.0.0 registry.company.com/macro-clients-ms:v1.0.0
docker push registry.company.com/macro-clients-ms:v1.0.0
```

#### **2. Docker Compose para Producción**

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    image: registry.company.com/macro-clients-ms:v1.0.0
    container_name: macro-clients-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
    depends_on:
      - postgres
      - prometheus
    networks:
      - macro-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    container_name: macro-postgres
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - macro-network
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:latest
    container_name: macro-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - macro-network
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: macro-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
    networks:
      - macro-network
    restart: unless-stopped

volumes:
  postgres_data:
  prometheus_data:
  grafana_data:

networks:
  macro-network:
    driver: bridge
```

### ☸️ Kubernetes Deployment

#### **1. ConfigMap y Secrets**

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: macro-clients-config
data:
  NODE_ENV: "production"
  DB_HOST: "postgres-service"
  DB_PORT: "5432"
  DB_NAME: "macro_clients_db"
  PROMETHEUS_ENABLED: "true"

---
apiVersion: v1
kind: Secret
metadata:
  name: macro-clients-secrets
type: Opaque
stringData:
  DB_USERNAME: "macro_user"
  DB_PASSWORD: "super_secure_password_123"
  JWT_SECRET: "your-jwt-secret-key"
```

#### **2. Deployment y Service**

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: macro-clients-ms
  labels:
    app: macro-clients-ms
spec:
  replicas: 3
  selector:
    matchLabels:
      app: macro-clients-ms
  template:
    metadata:
      labels:
        app: macro-clients-ms
    spec:
      containers:
      - name: macro-clients-ms
        image: registry.company.com/macro-clients-ms:v1.0.0
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: macro-clients-config
        - secretRef:
            name: macro-clients-secrets
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: macro-clients-service
spec:
  selector:
    app: macro-clients-ms
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

#### **3. Ingress**

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: macro-clients-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - api.macro.com
    secretName: macro-clients-tls
  rules:
  - host: api.macro.com
    http:
      paths:
      - path: /clients
        pathType: Prefix
        backend:
          service:
            name: macro-clients-service
            port:
              number: 80
```

---

## 📊 Monitoreo en Producción

### 📈 Métricas Clave a Monitorear

#### **1. Métricas de Aplicación**

```yaml
# monitoring/alerts.yml
groups:
- name: macro-clients-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(client_operations_total{status="error"}[5m]) > 0.1
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Alta tasa de errores en operaciones de clientes"
      description: "La tasa de errores en operaciones de clientes es {{ $value }}%"

  - alert: SlowDatabaseQueries
    expr: histogram_quantile(0.95, rate(client_operation_duration_bucket[5m])) > 1
    for: 1m
    labels:
      severity: warning
    annotations:
      summary: "Consultas de base de datos lentas"
      description: "El 95% de las consultas toman más de 1 segundo"

  - alert: HighMemoryUsage
    expr: process_resident_memory_bytes > 512000000
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Alto uso de memoria"
      description: "El proceso está usando más de 512MB de RAM"
```

#### **2. Dashboard de Grafana**

```json
// monitoring/grafana/dashboards/clients-dashboard.json
{
  "dashboard": {
    "title": "MACRO Clients Microservice",
    "panels": [
      {
        "title": "Operaciones por Segundo",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(client_operations_total[5m])",
            "legendFormat": "{{ operation }}"
          }
        ]
      },
      {
        "title": "Tiempo de Respuesta",
        "type": "graph", 
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(client_operation_duration_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Clientes Activos vs Total",
        "type": "stat",
        "targets": [
          {
            "expr": "client_active_total",
            "legendFormat": "Activos"
          },
          {
            "expr": "client_active_total + client_deleted_total",
            "legendFormat": "Total"
          }
        ]
      }
    ]
  }
}
```

### 🔍 Health Checks Avanzados

```typescript
// src/health-check/advanced-health.service.ts
@Injectable()
export class AdvancedHealthService {
  async performDeepHealthCheck(): Promise<HealthCheckResult> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkExternalServices(),
      this.checkMemoryUsage(),
      this.checkDiskSpace(),
      this.checkCacheHealth()
    ]);

    const results = checks.map((check, index) => ({
      name: ['database', 'external_services', 'memory', 'disk', 'cache'][index],
      status: check.status === 'fulfilled' ? 'ok' : 'error',
      details: check.status === 'fulfilled' ? check.value : check.reason
    }));

    const overallStatus = results.every(r => r.status === 'ok') ? 'ok' : 'error';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results
    };
  }

  private async checkExternalServices() {
    // Verificar conectividad con servicio de autenticación
    const authHealthy = await this.pingAuthService();
    
    // Verificar otros servicios externos
    const servicesHealthy = await this.checkDependentServices();

    return { auth: authHealthy, services: servicesHealthy };
  }

  private async checkMemoryUsage() {
    const used = process.memoryUsage();
    const maxMemory = 512 * 1024 * 1024; // 512MB limit
    
    return {
      heapUsed: used.heapUsed,
      heapTotal: used.heapTotal,
      rss: used.rss,
      healthy: used.rss < maxMemory
    };
  }
}
```

---

## 🐛 Debugging

### 🔍 Debugging Local

#### **1. Habilitar Logging Detallado**

```typescript
// src/main.ts
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'development' 
      ? ['log', 'error', 'warn', 'debug', 'verbose']
      : ['error', 'warn', 'log']
  });

  // Habilitar logging de TypeORM en desarrollo
  if (process.env.NODE_ENV === 'development') {
    const connection = app.get(DataSource);
    connection.logger = 'advanced-console';
  }

  await app.listen(3000);
}
```

#### **2. Debug de Queries GraphQL**

```typescript
// src/app.module.ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: 'src/schema.gql',
  playground: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
  formatError: (error) => {
    Logger.error(`GraphQL Error: ${error.message}`, error.stack);
    return {
      message: error.message,
      code: error.extensions?.code,
      timestamp: new Date().toISOString()
    };
  },
  plugins: [
    // Plugin para logging de queries
    {
      requestDidStart() {
        return {
          willSendResponse(requestContext) {
            const { request, response } = requestContext;
            Logger.debug(`GraphQL ${request.operationName}: ${JSON.stringify(response.data)}`);
          }
        };
      }
    }
  ]
}),
```

### 📊 Debugging en Producción

#### **1. Structured Logging**

```typescript
// src/common/logger.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StructuredLogger extends Logger {
  error(message: string, trace?: string, context?: string) {
    const logEntry = {
      level: 'error',
      message,
      trace,
      context,
      timestamp: new Date().toISOString(),
      service: 'macro-clients-ms',
      version: process.env.npm_package_version
    };

    super.error(JSON.stringify(logEntry));
  }

  warn(message: string, context?: string) {
    const logEntry = {
      level: 'warn',
      message,
      context,
      timestamp: new Date().toISOString(),
      service: 'macro-clients-ms'
    };

    super.warn(JSON.stringify(logEntry));
  }

  log(message: string, context?: string) {
    const logEntry = {
      level: 'info',
      message,
      context,
      timestamp: new Date().toISOString(),
      service: 'macro-clients-ms'
    };

    super.log(JSON.stringify(logEntry));
  }
}
```

#### **2. Request Tracing**

```typescript
// src/common/tracing.interceptor.ts
@Injectable()
export class TracingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const traceId = uuidv4();
    const request = context.switchToHttp().getRequest();
    
    request.traceId = traceId;
    
    const startTime = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        Logger.log(`Request completed: ${traceId} - ${duration}ms`, 'TracingInterceptor');
      }),
      catchError((error) => {
        Logger.error(`Request failed: ${traceId} - ${error.message}`, error.stack, 'TracingInterceptor');
        throw error;
      })
    );
  }
}
```

### 🛠️ Herramientas de Debugging

#### **1. Scripts de Diagnóstico**

```bash
#!/bin/bash
# scripts/diagnose.sh

echo "🔍 Iniciando diagnóstico del sistema..."

# Verificar conectividad de red
echo "📡 Verificando conectividad..."
curl -f http://localhost:3000/health || echo "❌ Health check falló"

# Verificar base de datos
echo "🗄️ Verificando base de datos..."
docker exec macro-postgres psql -U macro_user -d macro_clients_db -c "SELECT COUNT(*) FROM clientes;" || echo "❌ DB check falló"

# Verificar métricas
echo "📊 Verificando métricas..."
curl -s http://localhost:3000/metrics | grep client_operations_total || echo "❌ Métricas no disponibles"

# Verificar logs recientes
echo "📝 Logs recientes:"
docker logs macro-clients-app --tail 20

echo "✅ Diagnóstico completado"
```

#### **2. Test de Carga**

```javascript
// scripts/load-test.js
const autocannon = require('autocannon');

const loadTest = autocannon({
  url: 'http://localhost:3000/graphql',
  connections: 10,
  duration: 30,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: `
      query GetClients {
        clients(pagination: { limit: 5 }) {
          items { id nombre email }
          totalCount
        }
      }
    `
  })
});

loadTest.on('done', (result) => {
  console.log('📊 Resultados del test de carga:');
  console.log(`   Requests/sec: ${result.requests.average}`);
  console.log(`   Latency: ${result.latency.average}ms`);
  console.log(`   Throughput: ${result.throughput.average} bytes/sec`);
});
```

---

## 🎯 Checklist de Go-Live

### ✅ Pre-Deployment

- [ ] ✅ Tests unitarios pasan (100% coverage crítico)
- [ ] ✅ Tests de integración pasan
- [ ] ✅ Tests de carga completados satisfactoriamente
- [ ] ✅ Configuración de producción validada
- [ ] ✅ Secrets y variables de entorno configuradas
- [ ] ✅ Base de datos de producción lista
- [ ] ✅ Backups configurados
- [ ] ✅ Monitoreo configurado
- [ ] ✅ Alertas configuradas
- [ ] ✅ SSL/TLS configurado
- [ ] ✅ Health checks funcionando

### ✅ Post-Deployment

- [ ] ✅ Servicio respondiendo correctamente
- [ ] ✅ Health checks passing
- [ ] ✅ Métricas llegando a Prometheus
- [ ] ✅ Dashboards mostrando datos
- [ ] ✅ Logs estructurados generándose
- [ ] ✅ Alertas funcionando (test)
- [ ] ✅ Performance dentro de SLAs
- [ ] ✅ Documentación actualizada
- [ ] ✅ Equipo notificado del deployment
- [ ] ✅ Rollback plan documentado

---

## 📞 Soporte y Contacto

### 🚨 Escalación de Incidentes

**Nivel 1 - Self Service:**
- 📚 Documentación: Esta guía
- 🔍 Logs: `docker logs macro-clients-app`
- 📊 Métricas: http://localhost:9090

**Nivel 2 - Team Support:**
- 💬 Slack: #macro-clients-support
- 📧 Email: support@macro.com
- 🎫 Ticketing: JIRA/ServiceNow

**Nivel 3 - Engineering:**
- 💬 Slack: #engineering-escalation  
- 📞 On-call: PagerDuty
- 🚨 Emergency: +1-800-MACRO-911

### 📝 Plantillas de Reporte

**Bug Report:**
```
🐛 **Título**: [Descripción breve del problema]

**Entorno**: [desarrollo/staging/producción]

**Pasos para Reproducir**:
1. 
2. 
3. 

**Resultado Esperado**: 

**Resultado Actual**: 

**Logs/Screenshots**:

**Información Adicional**:
- Navegador/Cliente:
- Timestamp:
- TraceID (si aplica):
```

---

⭐ **¡Esta guía es un documento vivo! Contribuye con mejoras y actualizaciones.**
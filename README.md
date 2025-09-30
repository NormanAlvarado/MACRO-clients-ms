# 🏢 MACRO Clients Microservice

> 🚀 Microservicio de gestión de clientes desarrollado con NestJS, GraphQL, TypeORM y PostgreSQL

## 📋 Tabla de Contenidos

- [🎯 Descripción General](#-descripción-general)
- [🏗️ Arquitectura](#️-arquitectura)
- [🛠️ Tecnologías](#️-tecnologías)
- [⚡ Inicio Rápido](#-inicio-rápido)
- [📊 Monitoreo](#-monitoreo)
- [🔌 API Endpoints](#-api-endpoints)
- [📚 Documentación Adicional](#-documentación-adicional)

## 🎯 Descripción General

El **MACRO Clients Microservice** es un sistema completo para la gestión de clientes que incluye:

- ✅ **Gestión completa de clientes** (CRUD)
- 🏠 **Manejo de direcciones** por cliente
- ⚙️ **Preferencias personalizables** por cliente  
- 🔐 **Autenticación y autorización** vía gRPC
- 📊 **Monitoreo con Prometheus** y Grafana
- 🩺 **Health Checks** integrados
- 🔍 **GraphQL API** con playground incluido

## 🏗️ Arquitectura

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   GraphQL Client    │────│  MACRO Clients MS   │────│    PostgreSQL DB    │
│   (Frontend/API)    │    │     (NestJS)        │    │     (Database)      │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
                                      │
                           ┌─────────────────────┐
                           │   Auth Service      │
                           │     (gRPC)          │
                           └─────────────────────┘
                                      │
                           ┌─────────────────────┐
                           │   Monitoring Stack  │
                           │ Prometheus + Grafana│
                           └─────────────────────┘
```

## 🛠️ Tecnologías

### 🔧 Backend
- **NestJS** - Framework principal
- **TypeScript** - Lenguaje de programación
- **GraphQL** - API query language
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos principal

### 📡 Comunicación
- **gRPC** - Comunicación con servicio de autenticación
- **GraphQL** - API principal para clientes

### 📊 Monitoreo
- **Prometheus** - Recolección de métricas
- **Grafana** - Visualización de datos
- **Docker** - Containerización

## ⚡ Inicio Rápido

### 📋 Pre-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Docker** y **Docker Compose**
- **PostgreSQL** (o usar el contenedor Docker)

### 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/NormanAlvarado/MACRO-clients-ms.git
cd MACRO-clients-ms
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según tu configuración
nano .env
```

4. **Levantar la base de datos**
```bash
# Opción 1: Usar Docker Compose (recomendado)
docker-compose up -d postgres

# Opción 2: Usar tu propia instancia de PostgreSQL
# Asegúrate de tener las credenciales correctas en .env
```

5. **Ejecutar migraciones y seeds**
```bash
# Sincronizar esquema de base de datos
npm run build
npm start

# En otra terminal, ejecutar seeds (opcional)
curl -X POST http://localhost:3000/seeds
```

6. **Iniciar el servidor**
```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

### ✅ Verificación

Después de iniciar el servidor, deberías ver:

```
🚀 Aplicación ejecutándose en: http://localhost:3000
📊 GraphQL Playground disponible en: http://localhost:3000/graphql
```

## 📊 Monitoreo

### 🔧 Configuración de Monitoreo

1. **Levantar el stack de monitoreo completo**
```bash
# Levantar PostgreSQL + Prometheus + Grafana
docker-compose -f docker-compose.monitoring.yml up -d

# Verificar que todos los servicios estén corriendo
docker-compose -f docker-compose.monitoring.yml ps
```

2. **Acceder a los servicios**

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| 🎯 **Microservicio** | http://localhost:3000 | - |
| 🔍 **GraphQL Playground** | http://localhost:3000/graphql | - |
| 📊 **Prometheus** | http://localhost:9090 | - |
| 📈 **Grafana** | http://localhost:3001 | admin/admin |
| 📊 **Métricas** | http://localhost:3000/metrics | - |

### 📈 Métricas Disponibles

El microservicio expone las siguientes métricas personalizadas:

- `client_operations_total` - Total de operaciones CRUD en clientes
- `client_queries_total` - Total de consultas GraphQL realizadas  
- `client_active_total` - Número total de clientes activos
- `client_deleted_total` - Número total de clientes eliminados
- `client_operation_duration` - Duración de operaciones en clientes

## 🔌 API Endpoints

### 🌐 GraphQL API

**Endpoint principal:** `http://localhost:3000/graphql`

#### 👥 **Clientes**

<details>
<summary>📋 Consultar todos los clientes</summary>

```graphql
query GetClients($pagination: PaginationInput) {
  clients(pagination: $pagination) {
    items {
      id
      nombre
      email
      telefono
      fechaNacimiento
      estado
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
    hasPreviousPage
  }
}
```

**Variables:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 10
  }
}
```
</details>

<details>
<summary>👤 Consultar un cliente por ID</summary>

```graphql
query GetClient($id: String!) {
  client(id: $id) {
    id
    nombre
    email
    telefono
    fechaNacimiento
    estado
    direcciones {
      id
      direccion
      ciudad
      codigoPostal
      pais
    }
    preferencias {
      id
      idioma
      moneda
      notificaciones
      tema
    }
  }
}
```

**Variables:**
```json
{
  "id": "uuid-del-cliente"
}
```
</details>

<details>
<summary>➕ Crear un cliente</summary>

```graphql
mutation CreateClient($createClientInput: CreateClientInput!) {
  createClient(createClientInput: $createClientInput) {
    id
    nombre
    email
    telefono
    fechaNacimiento
    estado
  }
}
```

**Variables:**
```json
{
  "createClientInput": {
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "+1234567890",
    "fechaNacimiento": "1990-01-15"
  }
}
```
</details>

<details>
<summary>✏️ Actualizar un cliente</summary>

```graphql
mutation UpdateClient($id: String!, $updateClientInput: UpdateClientInput!) {
  updateClient(id: $id, updateClientInput: $updateClientInput) {
    id
    nombre
    email
    telefono
    estado
  }
}
```

**Variables:**
```json
{
  "id": "uuid-del-cliente",
  "updateClientInput": {
    "nombre": "Juan Carlos Pérez",
    "telefono": "+1234567891"
  }
}
```
</details>

<details>
<summary>🗑️ Eliminar un cliente</summary>

```graphql
mutation RemoveClient($id: String!) {
  removeClient(id: $id)
}
```

**Variables:**
```json
{
  "id": "uuid-del-cliente"
}
```
</details>

#### 🏠 **Direcciones de Cliente**

<details>
<summary>📋 Consultar direcciones de un cliente</summary>

```graphql
query GetClientAddresses($clientId: String!, $pagination: PaginationInput) {
  clientAddresses(clientId: $clientId, pagination: $pagination) {
    items {
      id
      direccion
      ciudad
      estado
      codigoPostal
      pais
      tipo
      esPrincipal
    }
    totalCount
  }
}
```
</details>

<details>
<summary>➕ Crear dirección</summary>

```graphql
mutation CreateClientAddress($createClientAddressInput: CreateClientAddressInput!) {
  createClientAddress(createClientAddressInput: $createClientAddressInput) {
    id
    direccion
    ciudad
    codigoPostal
    pais
  }
}
```

**Variables:**
```json
{
  "createClientAddressInput": {
    "clienteId": "uuid-del-cliente",
    "direccion": "123 Main St",
    "ciudad": "Ciudad",
    "estado": "Estado",
    "codigoPostal": "12345",
    "pais": "País",
    "tipo": "casa",
    "esPrincipal": true
  }
}
```
</details>

#### ⚙️ **Preferencias de Cliente**

<details>
<summary>📋 Consultar preferencias de un cliente</summary>

```graphql
query GetClientPreferences($clientId: String!) {
  clientPreferences(clientId: $clientId) {
    id
    idioma
    moneda
    zonaHoraria
    notificaciones
    tema
    configuracionPrivacidad
  }
}
```
</details>

<details>
<summary>➕ Crear/Actualizar preferencias</summary>

```graphql
mutation CreateClientPreferences($createClientPreferencesInput: CreateClientPreferencesInput!) {
  createClientPreferences(createClientPreferencesInput: $createClientPreferencesInput) {
    id
    idioma
    moneda
    notificaciones
    tema
  }
}
```

**Variables:**
```json
{
  "createClientPreferencesInput": {
    "clienteId": "uuid-del-cliente",
    "idioma": "es",
    "moneda": "USD",
    "zonaHoraria": "America/Mexico_City",
    "notificaciones": true,
    "tema": "oscuro"
  }
}
```
</details>

### 🩺 **Health Check**

<details>
<summary>✅ Verificar estado del sistema</summary>

```graphql
query HealthCheck {
  health {
    status
    timestamp
    uptime
    database {
      status
      responseTime
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "health": {
      "status": "ok",
      "timestamp": "2025-09-29T22:15:30.123Z",
      "uptime": 12345.67,
      "database": {
        "status": "ok",
        "responseTime": 5.2
      }
    }
  }
}
```
</details>

### 🔗 **REST Endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/auth/test` | Test de autenticación |
| `GET` | `/auth` | Información de autenticación |
| `GET` | `/metrics` | Métricas de Prometheus |
| `POST` | `/seeds` | Ejecutar seeds de datos |

## 📚 Documentación Adicional

- 📖 **[API Endpoints Guide](./docs/API_ENDPOINTS.md)** - Guía detallada de todos los endpoints
- 🏗️ **[Data Models Guide](./docs/DATA_MODELS.md)** - Documentación de modelos y relaciones
- 🚀 **[Usage Guide](./docs/USAGE_GUIDE.md)** - Guía de uso para equipos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte y preguntas:

- 📧 Email: norman.alvarado@macro.com
- 💬 Slack: #macro-clients-support
- 🐛 Issues: [GitHub Issues](https://github.com/NormanAlvarado/MACRO-clients-ms/issues)

---

⭐ **¡Dale una estrella si este proyecto te ayudó!**

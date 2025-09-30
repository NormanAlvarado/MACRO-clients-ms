# 🔌 API Endpoints - Guía Completa

> 📚 Documentación detallada de todos los endpoints disponibles en el MACRO Clients Microservice

## 📋 Tabla de Contenidos

- [🌐 GraphQL API](#-graphql-api)
- [🔗 REST Endpoints](#-rest-endpoints)
- [🔐 Autenticación](#-autenticación)
- [📊 Códigos de Respuesta](#-códigos-de-respuesta)
- [🧪 Ejemplos de Uso](#-ejemplos-de-uso)

## 🌐 GraphQL API

### 🎯 Endpoint Principal

```
URL: http://localhost:3000/graphql
Método: POST
Content-Type: application/json
```

### 🖥️ GraphQL Playground

Para pruebas interactivas, accede a:
```
URL: http://localhost:3000/graphql
```

---

## 👥 Gestión de Clientes

### 📋 1. Consultar Todos los Clientes

**Query:**
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
      direcciones {
        id
        direccion
        ciudad
        pais
        esPrincipal
      }
      preferencias {
        id
        idioma
        moneda
        tema
      }
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

**Respuesta Exitosa:**
```json
{
  "data": {
    "clients": {
      "items": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "nombre": "Juan Pérez",
          "email": "juan.perez@example.com",
          "telefono": "+52-555-1234",
          "fechaNacimiento": "1990-05-15",
          "estado": "activo",
          "createdAt": "2025-09-29T10:30:00.000Z",
          "updatedAt": "2025-09-29T10:30:00.000Z",
          "direcciones": [
            {
              "id": "addr-123",
              "direccion": "Av. Reforma 123",
              "ciudad": "Ciudad de México",
              "pais": "México",
              "esPrincipal": true
            }
          ],
          "preferencias": {
            "id": "pref-123",
            "idioma": "es",
            "moneda": "MXN",
            "tema": "claro"
          }
        }
      ],
      "totalCount": 25,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### 👤 2. Consultar Cliente por ID

**Query:**
```graphql
query GetClient($id: String!) {
  client(id: $id) {
    id
    nombre
    email
    telefono
    fechaNacimiento
    estado
    createdAt
    updatedAt
    direcciones {
      id
      direccion
      ciudad
      estado
      codigoPostal
      pais
      tipo
      esPrincipal
      createdAt
    }
    preferencias {
      id
      idioma
      moneda
      zonaHoraria
      notificaciones
      tema
      configuracionPrivacidad
      createdAt
      updatedAt
    }
  }
}
```

**Variables:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### ➕ 3. Crear Cliente

**Mutation:**
```graphql
mutation CreateClient($createClientInput: CreateClientInput!) {
  createClient(createClientInput: $createClientInput) {
    id
    nombre
    email
    telefono
    fechaNacimiento
    estado
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "createClientInput": {
    "nombre": "María González",
    "email": "maria.gonzalez@example.com",
    "telefono": "+52-555-5678",
    "fechaNacimiento": "1985-12-20"
  }
}
```

**Validaciones:**
- ✅ `nombre`: Requerido, mínimo 2 caracteres
- ✅ `email`: Requerido, formato válido, único
- ✅ `telefono`: Opcional, formato internacional
- ✅ `fechaNacimiento`: Formato ISO 8601 (YYYY-MM-DD)

### ✏️ 4. Actualizar Cliente

**Mutation:**
```graphql
mutation UpdateClient($id: String!, $updateClientInput: UpdateClientInput!) {
  updateClient(id: $id, updateClientInput: $updateClientInput) {
    id
    nombre
    email
    telefono
    fechaNacimiento
    estado
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "updateClientInput": {
    "nombre": "María Alejandra González",
    "telefono": "+52-555-9999"
  }
}
```

### 🗑️ 5. Eliminar Cliente (Soft Delete)

**Mutation:**
```graphql
mutation RemoveClient($id: String!) {
  removeClient(id: $id)
}
```

**Variables:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Respuesta:**
```json
{
  "data": {
    "removeClient": true
  }
}
```

---

## 🏠 Gestión de Direcciones

### 📋 1. Consultar Direcciones de un Cliente

**Query:**
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
  "clientId": "123e4567-e89b-12d3-a456-426614174000",
  "pagination": {
    "page": 1,
    "limit": 5
  }
}
```

### ➕ 2. Crear Dirección

**Mutation:**
```graphql
mutation CreateClientAddress($createClientAddressInput: CreateClientAddressInput!) {
  createClientAddress(createClientAddressInput: $createClientAddressInput) {
    id
    direccion
    ciudad
    estado
    codigoPostal
    pais
    tipo
    esPrincipal
    createdAt
  }
}
```

**Variables:**
```json
{
  "createClientAddressInput": {
    "clienteId": "123e4567-e89b-12d3-a456-426614174000",
    "direccion": "Calle Insurgentes Sur 456",
    "ciudad": "Ciudad de México",
    "estado": "CDMX",
    "codigoPostal": "03100",
    "pais": "México",
    "tipo": "casa",
    "esPrincipal": false
  }
}
```

**Tipos de Dirección Válidos:**
- `casa` - Casa/Residencia
- `trabajo` - Oficina/Trabajo
- `facturacion` - Dirección de facturación
- `envio` - Dirección de envío
- `otro` - Otros

### ✏️ 3. Actualizar Dirección

**Mutation:**
```graphql
mutation UpdateClientAddress($id: String!, $updateClientAddressInput: UpdateClientAddressInput!) {
  updateClientAddress(id: $id, updateClientAddressInput: $updateClientAddressInput) {
    id
    direccion
    ciudad
    estado
    codigoPostal
    pais
    tipo
    esPrincipal
    updatedAt
  }
}
```

### 🗑️ 4. Eliminar Dirección

**Mutation:**
```graphql
mutation RemoveClientAddress($id: String!) {
  removeClientAddress(id: $id)
}
```

---

## ⚙️ Gestión de Preferencias

### 📋 1. Consultar Preferencias de un Cliente

**Query:**
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
    createdAt
    updatedAt
    cliente {
      id
      nombre
      email
    }
  }
}
```

**Variables:**
```json
{
  "clientId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### ➕ 2. Crear/Actualizar Preferencias

**Mutation:**
```graphql
mutation CreateClientPreferences($createClientPreferencesInput: CreateClientPreferencesInput!) {
  createClientPreferences(createClientPreferencesInput: $createClientPreferencesInput) {
    id
    idioma
    moneda
    zonaHoraria
    notificaciones
    tema
    configuracionPrivacidad
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "createClientPreferencesInput": {
    "clienteId": "123e4567-e89b-12d3-a456-426614174000",
    "idioma": "es",
    "moneda": "MXN",
    "zonaHoraria": "America/Mexico_City",
    "notificaciones": true,
    "tema": "oscuro",
    "configuracionPrivacidad": {
      "compartirDatos": false,
      "recibirMarketing": true,
      "perfilPublico": false
    }
  }
}
```

**Valores Válidos:**

**Idiomas:**
- `es` - Español
- `en` - Inglés
- `fr` - Francés
- `pt` - Portugués

**Monedas:**
- `MXN` - Peso Mexicano
- `USD` - Dólar Estadounidense
- `EUR` - Euro
- `CAD` - Dólar Canadiense

**Temas:**
- `claro` - Tema claro
- `oscuro` - Tema oscuro
- `auto` - Automático (según sistema)

---

## 🩺 Health Check

### ✅ Verificar Estado del Sistema

**Query:**
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

**Respuesta:**
```json
{
  "data": {
    "health": {
      "status": "ok",
      "timestamp": "2025-09-29T22:30:00.000Z",
      "uptime": 3661.234,
      "database": {
        "status": "ok",
        "responseTime": 12.5
      }
    }
  }
}
```

**Estados Posibles:**
- `ok` - Sistema funcionando correctamente
- `error` - Sistema con problemas
- `maintenance` - Sistema en mantenimiento

---

## 🔗 REST Endpoints

### 🔐 Autenticación

#### 🧪 Test de Autenticación
```http
GET /auth/test
Content-Type: application/json
```

**Respuesta:**
```json
{
  "message": "Auth service is working",
  "timestamp": "2025-09-29T22:30:00.000Z"
}
```

#### ℹ️ Información de Autenticación
```http
GET /auth
Content-Type: application/json
```

### 📊 Métricas

#### 📈 Prometheus Metrics
```http
GET /metrics
Content-Type: text/plain
```

**Respuesta:**
```
# HELP client_operations_total Total number of client operations
# TYPE client_operations_total counter
client_operations_total{operation="create"} 15
client_operations_total{operation="read"} 245
client_operations_total{operation="update"} 32
client_operations_total{operation="delete"} 8

# HELP client_queries_total Total number of GraphQL queries
# TYPE client_queries_total counter
client_queries_total 523

# HELP client_active_total Current number of active clients
# TYPE client_active_total gauge
client_active_total 142
```

### 🌱 Seeds de Datos

#### 📊 Ejecutar Seeds
```http
POST /seeds
Content-Type: application/json
```

**Respuesta:**
```json
{
  "message": "Seeds executed successfully",
  "data": {
    "clientsCreated": 10,
    "addressesCreated": 25,
    "preferencesCreated": 10
  },
  "timestamp": "2025-09-29T22:30:00.000Z"
}
```

---

## 🔐 Autenticación

### 🎫 Headers Requeridos

Para endpoints protegidos, incluir:

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### 🔑 Obtener Token

El token se obtiene del servicio de autenticación externo vía gRPC. Consulta la documentación del servicio de autenticación para más detalles.

---

## 📊 Códigos de Respuesta

### ✅ Códigos Exitosos
- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente

### ⚠️ Códigos de Error del Cliente
- `400 Bad Request` - Datos inválidos en la solicitud
- `401 Unauthorized` - Token de autenticación inválido o faltante
- `403 Forbidden` - Sin permisos para realizar la operación
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej. email duplicado)
- `422 Unprocessable Entity` - Errores de validación

### 🔥 Códigos de Error del Servidor
- `500 Internal Server Error` - Error interno del servidor
- `502 Bad Gateway` - Error de comunicación con servicios externos
- `503 Service Unavailable` - Servicio temporalmente no disponible

### 📋 Estructura de Error GraphQL

```json
{
  "errors": [
    {
      "message": "Cliente no encontrado",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["client"],
      "extensions": {
        "code": "CLIENT_NOT_FOUND",
        "timestamp": "2025-09-29T22:30:00.000Z"
      }
    }
  ],
  "data": null
}
```

---

## 🧪 Ejemplos de Uso

### 🎯 Caso de Uso 1: Registro Completo de Cliente

```bash
# 1. Crear el cliente
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateClient($input: CreateClientInput!) { createClient(createClientInput: $input) { id nombre email } }",
    "variables": {
      "input": {
        "nombre": "Ana Martínez",
        "email": "ana.martinez@example.com",
        "telefono": "+52-555-1111"
      }
    }
  }'

# 2. Agregar dirección principal
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateAddress($input: CreateClientAddressInput!) { createClientAddress(createClientAddressInput: $input) { id direccion } }",
    "variables": {
      "input": {
        "clienteId": "CLIENT_ID_FROM_STEP_1",
        "direccion": "Av. Universidad 123",
        "ciudad": "Guadalajara",
        "estado": "Jalisco",
        "codigoPostal": "44100",
        "pais": "México",
        "tipo": "casa",
        "esPrincipal": true
      }
    }
  }'

# 3. Configurar preferencias
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreatePreferences($input: CreateClientPreferencesInput!) { createClientPreferences(createClientPreferencesInput: $input) { id idioma moneda } }",
    "variables": {
      "input": {
        "clienteId": "CLIENT_ID_FROM_STEP_1",
        "idioma": "es",
        "moneda": "MXN",
        "tema": "claro",
        "notificaciones": true
      }
    }
  }'
```

### 🔍 Caso de Uso 2: Búsqueda y Filtrado

```javascript
// Búsqueda paginada con JavaScript/Node.js
const axios = require('axios');

async function searchClients(searchParams) {
  const query = `
    query GetClients($pagination: PaginationInput) {
      clients(pagination: $pagination) {
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
        hasNextPage
      }
    }
  `;
  
  const response = await axios.post('http://localhost:3000/graphql', {
    query,
    variables: {
      pagination: {
        page: searchParams.page || 1,
        limit: searchParams.limit || 10
      }
    }
  });
  
  return response.data;
}

// Uso
searchClients({ page: 1, limit: 20 })
  .then(data => console.log('Clientes:', data.data.clients))
  .catch(error => console.error('Error:', error));
```

### 📊 Caso de Uso 3: Monitoreo de Métricas

```bash
# Verificar métricas del sistema
curl http://localhost:3000/metrics | grep client_

# Verificar estado de salud
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { health { status uptime database { status responseTime } } }"
  }'
```

---

## 🚨 Troubleshooting

### ❌ Problemas Comunes

**1. Error de conexión a base de datos**
```json
{
  "errors": [
    {
      "message": "Cannot connect to database",
      "extensions": {
        "code": "DATABASE_CONNECTION_ERROR"
      }
    }
  ]
}
```
**Solución:** Verificar que PostgreSQL esté corriendo y las credenciales sean correctas.

**2. Email duplicado**
```json
{
  "errors": [
    {
      "message": "El email ya existe",
      "extensions": {
        "code": "DUPLICATE_EMAIL"
      }
    }
  ]
}
```
**Solución:** Usar un email diferente o actualizar el cliente existente.

**3. Cliente no encontrado**
```json
{
  "errors": [
    {
      "message": "Cliente no encontrado",
      "extensions": {
        "code": "CLIENT_NOT_FOUND"
      }
    }
  ]
}
```
**Solución:** Verificar que el ID del cliente sea correcto y que el cliente no haya sido eliminado.

---

## 📞 Soporte

Si encuentras problemas o tienes preguntas:

- 📧 **Email:** soporte@macro.com
- 💬 **Slack:** #api-support  
- 📚 **Docs:** [Documentación completa](../README.md)
- 🐛 **Issues:** [GitHub Issues](https://github.com/NormanAlvarado/MACRO-clients-ms/issues)

---

⭐ **¡Recuerda revisar el GraphQL Playground para explorar el esquema completo!**
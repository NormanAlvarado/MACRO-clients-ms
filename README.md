# 🏢 MACRO Clients Microservice

Un microservicio moderno para la gestión de clientes construido con **NestJS**, **MongoDB**, **Mongoose** y **GraphQL**.

## 🌟 Características

- ✨ API GraphQL con Apollo Server
- 🗄️ MongoDB con Mongoose ODM
- 🔍 Operaciones CRUD completas para clientes
- 🗑️ Soft delete (eliminación lógica)
- ✅ Validación automática de datos
- 🌱 Seeds para datos de prueba
- 🐳 Docker para desarrollo local
- 🎯 TypeScript para mayor robustez

## 🚀 Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) | ^11.0.1 | Framework backend |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | ^7.0 | Base de datos NoSQL |
| ![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white) | ^16.11.0 | API Query Language |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | ^5.7.3 | Lenguaje tipado |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) | Latest | Contenedorización |

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) **Node.js** (v18 o superior)
- ![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white) **npm** (v8 o superior)
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) **Docker** y **Docker Compose**

## 🛠️ Instalación y Configuración

### 1. 📥 Clonar el repositorio

```bash
git clone https://github.com/NormanAlvarado/MACRO-clients-ms.git
cd MACRO-clients-ms
```

### 2. 📦 Instalar dependencias

```bash
npm install
```

### 3. 🐳 Iniciar MongoDB con Docker

```bash
docker compose up -d
```

Esto iniciará MongoDB en el puerto `27017`.

### 4. 🌱 Poblar la base de datos (Opcional)

Para agregar datos de prueba:

```bash
# Ejecutar seed por primera vez
npm run seed

# Para forzar recreación de datos
npm run seed:force
```

### 5. 🚀 Iniciar la aplicación

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run start:prod
```

## 🌐 URLs Importantes

Una vez que la aplicación esté ejecutándose:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| 📊 **GraphQL Playground** | http://localhost:3000/graphql | Interfaz para probar queries |
| 🔌 **API GraphQL** | http://localhost:3000/graphql | Endpoint principal de la API |
| 🗄️ **MongoDB** | mongodb://localhost:27017/macro-clients-db | Base de datos |

## 📚 API GraphQL

> 💡 **Nota importante:** GraphQL funciona diferente a REST. **Todas las operaciones van por POST** al mismo endpoint `/graphql`, pero se diferencian por el tipo de operación (`query` o `mutation`) en el cuerpo de la petición.

### 🔍 Queries (Consultas - equivalen a GET en REST)

#### Obtener todos los clientes activos
```graphql
query {
  clients {
    _id
    nombre
    email
    telefono
    direccion
    fecha_registro
  }
}
```

#### Obtener un cliente específico
```graphql
query {
  client(id: "CLIENT_ID") {
    _id
    nombre
    email
    telefono
    direccion
    fecha_registro
  }
}
```

#### Obtener todos los clientes (incluyendo eliminados)
```graphql
query {
  allClientsIncludingDeleted {
    _id
    nombre
    email
    isDeleted
  }
}
```

### ✏️ Mutations (Operaciones - equivalen a POST/PUT/DELETE en REST)

#### Crear un nuevo cliente
```graphql
mutation {
  createClient(createClientInput: {
    nombre: "Juan Pérez"
    email: "juan@example.com"
    telefono: "+34 123 456 789"
    direccion: "Calle Mayor 123, Madrid"
  }) {
    _id
    nombre
    email
    fecha_registro
  }
}
```

#### Actualizar un cliente
```graphql
mutation {
  updateClient(updateClientInput: {
    id: "CLIENT_ID"
    nombre: "Juan Pérez Actualizado"
  }) {
    _id
    nombre
    email
  }
}
```

#### Eliminar un cliente (soft delete)
```graphql
mutation {
  removeClient(id: "CLIENT_ID") {
    _id
    nombre
    isDeleted
  }
}
```

#### Restaurar un cliente eliminado
```graphql
mutation {
  restoreClient(id: "CLIENT_ID") {
    _id
    nombre
    isDeleted
  }
}
```

#### Eliminar permanentemente
```graphql
mutation {
  permanentDeleteClient(id: "CLIENT_ID")
}
```

## 🧪 Pruebas con Postman

> ⚠️ **IMPORTANTE:** En GraphQL, **TODAS las operaciones van por POST**, incluso las consultas (queries) que normalmente serían GET en REST.

### ✅ Configuración Correcta para Postman

#### Para CUALQUIER operación GraphQL (queries y mutations):

1. **Método:** `POST` ← (Siempre POST, nunca GET)
2. **URL:** `http://localhost:3000/graphql`
3. **Headers:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body:**
   - Selecciona **"raw"**
   - Selecciona **"JSON"** en el dropdown

### 📖 Ejemplos de Requests

#### 🔍 Obtener todos los clientes (equivale a GET)
```json
{
  "query": "query { clients { _id nombre email telefono direccion fecha_registro } }"
}
```

#### 👤 Obtener un cliente específico
```json
{
  "query": "query { client(id: \"CLIENT_ID_AQUI\") { _id nombre email telefono direccion fecha_registro } }"
}
```

#### ➕ Crear un nuevo cliente
```json
{
  "query": "mutation { createClient(createClientInput: { nombre: \"Juan Pérez\", email: \"juan@example.com\", telefono: \"+34 123 456 789\", direccion: \"Calle Mayor 123\" }) { _id nombre email fecha_registro } }"
}
```

#### ✏️ Actualizar un cliente
```json
{
  "query": "mutation { updateClient(updateClientInput: { id: \"CLIENT_ID_AQUI\", nombre: \"Nombre Actualizado\" }) { _id nombre email } }"
}
```

#### 🗑️ Eliminar un cliente (soft delete)
```json
{
  "query": "mutation { removeClient(id: \"CLIENT_ID_AQUI\") { _id nombre isDeleted } }"
}
```

### 📋 Respuestas Esperadas

#### ✅ Respuesta Exitosa
```json
{
  "data": {
    "clients": [
      {
        "_id": "66e85a1b2f1234567890abcd",
        "nombre": "María García",
        "email": "maria.garcia@email.com",
        "telefono": "+34 612 345 678",
        "direccion": "Calle Mayor 15, Madrid",
        "fecha_registro": "2024-09-16T10:30:00.000Z"
      }
    ]
  }
}
```

#### 📭 Sin datos (normal si no hay clientes)
```json
{
  "data": {
    "clients": []
  }
}
```

#### ❌ Error de configuración
```json
{
  "errors": [
    {
      "message": "Error message here...",
      "extensions": {
        "code": "BAD_REQUEST"
      }
    }
  ]
}
```

### 🔧 Troubleshooting Postman

| Problema | Causa | Solución |
|----------|-------|----------|
| Error CSRF | Falta Content-Type | Agregar header `Content-Type: application/json` |
| "Could not send request" | App no está corriendo | Ejecutar `npm run start:dev` |
| Error 404 | URL incorrecta | Usar `http://localhost:3000/graphql` |
| Sin respuesta | Método GET usado | **Cambiar a POST** |

### 💡 Diferencias con REST API

| Aspecto | REST | GraphQL |
|---------|------|---------|
| **Método HTTP** | GET, POST, PUT, DELETE | **Siempre POST** |
| **Endpoints** | `/clients`, `/clients/1` | **Un solo endpoint** `/graphql` |
| **Datos solicitados** | Todos los campos | **Solo los campos que necesites** |
| **Queries** | URL parameters | **En el body JSON** |

## 🗄️ Conectar a MongoDB

### MongoDB Compass
**Cadena de conexión:**
```
mongodb://localhost:27017/macro-clients-db
```

### Configuración manual
- **Host:** `localhost`
- **Puerto:** `27017`
- **Base de datos:** `macro-clients-db`
- **Autenticación:** No requerida

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| 🏗️ **Build** | `npm run build` | Compilar el proyecto |
| 🚀 **Start** | `npm run start` | Iniciar en modo producción |
| 🔄 **Dev** | `npm run start:dev` | Iniciar con hot-reload |
| 🌱 **Seed** | `npm run seed` | Poblar base de datos |
| 🔄 **Seed Force** | `npm run seed:force` | Recrear datos de prueba |
| 🧪 **Test** | `npm run test` | Ejecutar pruebas |
| 🧹 **Lint** | `npm run lint` | Verificar código |

## 📁 Estructura del Proyecto

```
src/
├── 📂 client/                 # Módulo de clientes
│   ├── 📂 dto/               # Data Transfer Objects
│   ├── 📂 entities/          # Schemas de MongoDB
│   ├── 📄 client.service.ts  # Lógica de negocio
│   ├── 📄 client.resolver.ts # Resolvers GraphQL
│   └── 📄 client.module.ts   # Módulo NestJS
├── 📂 seeds/                 # Scripts de datos iniciales
├── 📄 app.module.ts          # Módulo principal
├── 📄 main.ts               # Punto de entrada
└── 📄 schema.gql            # Schema GraphQL generado
```

## 🛡️ Validaciones

El proyecto incluye validaciones automáticas para:

- ✅ **Email:** Formato válido
- ✅ **Nombre:** Máximo 150 caracteres, requerido
- ✅ **Teléfono:** Máximo 20 caracteres, requerido
- ✅ **Dirección:** Requerida
- ✅ **Unicidad:** Email único por cliente

## 🔧 Configuración de Desarrollo

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/macro-clients-db
NODE_ENV=development
```

### Docker Commands Útiles

```bash
# Ver estado de contenedores
docker compose ps

# Ver logs de MongoDB
docker compose logs mongodb

# Detener MongoDB
docker compose down

# Limpiar datos de MongoDB
docker compose down && sudo rm -rf mongo/*
```

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
```bash
# Verificar que Docker esté ejecutándose
docker compose ps

# Reiniciar MongoDB
docker compose restart mongodb
```

### Puerto 3000 ocupado
```bash
# Cambiar puerto en .env
PORT=3001
```

### Limpiar datos corruptos
```bash
# Detener todo y limpiar
docker compose down
sudo rm -rf mongo/*
docker compose up -d
npm run seed:force
```

## 👨‍💻 Contribuir

1. 🍴 Fork el proyecto
2. 🌿 Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. 💾 Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. 📤 Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. 🔄 Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia UNLICENSED.

## 📧 Contacto

**Norman Alvarado** - [@NormanAlvarado](https://github.com/NormanAlvarado)

---

<div align="center">
  <p>⭐ ¡Dale una estrella si te gusta el proyecto! ⭐</p>
  <p>🚀 Construido con ❤️ usando NestJS y MongoDB</p>
</div>

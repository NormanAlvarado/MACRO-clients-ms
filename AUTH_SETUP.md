# 🚀 MACRO Clients Microservice - Authentication Setup

## 📋 Descripción
Este microservicio maneja la gestión de clientes con autenticación basada en gRPC y roles de usuario.

## 🔐 Sistema de Autenticación

### Roles Disponibles
- **MASTER**: Acceso completo a todas las operaciones
- **MODERATOR**: Puede crear, leer, actualizar y eliminar clientes
- **COLABORATOR**: Puede leer y actualizar clientes
- **BASIC**: Solo puede leer clientes

### Usuarios por Defecto
Al ejecutar las seeds, se crearán los siguientes usuarios:
- `master@macro.com` (MASTER) - Password: `MasterPassword123!`
- `moderator@macro.com` (MODERATOR) - Password: `ModeratorPassword123!`
- `colaborator@macro.com` (COLABORATOR) - Password: `ColaboratorPassword123!`
- `basic@macro.com` (BASIC) - Password: `BasicPassword123!`

## 🛠️ Configuración

### 1. Variables de Entorno
Asegúrate de tener configurado tu archivo `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=macro-clients-db

# Servicio de Autenticación gRPC
GRPC_AUTH_SERVICE=GRPC_AUTH_SERVICE
GRPC_AUTH_URL=localhost:3003
```

### 2. Dependencias
Instalar dependencias:
```bash
npm install
```

### 3. Base de Datos
Asegúrate de tener PostgreSQL ejecutándose con la configuración especificada en el `.env`.

## 🚀 Ejecución

### 1. Servicio de Autenticación
**IMPORTANTE**: Antes de ejecutar este microservicio, asegúrate de tener el servicio de autenticación gRPC ejecutándose en `localhost:3003`.

### 2. Ejecutar el Microservicio
```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

### 3. Ejecutar Seeds
Para crear usuarios y datos de prueba:
```bash
npm run seed
```

## 📚 Operaciones GraphQL

### Consultas Protegidas
Todas las operaciones GraphQL requieren autenticación. Incluye el token JWT en el header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Ejemplos de Queries

#### Obtener todos los clientes (requiere cualquier rol)
```graphql
query {
  clients {
    id
    nombre
    email
    telefono
    fecha_registro
  }
}
```

#### Crear un cliente (requiere MODERATOR o MASTER)
```graphql
mutation {
  createClient(createClientInput: {
    nombre: "Nuevo Cliente"
    email: "nuevo@email.com"
    telefono: "+506 8888-9999"
  }) {
    id
    nombre
    email
  }
}
```

#### Obtener clientes eliminados (solo MASTER)
```graphql
query {
  allClientsIncludingDeleted {
    id
    nombre
    isDeleted
  }
}
```

## 🔧 Estructura del Proyecto

```
src/
├── auth/                    # Sistema de autenticación gRPC
│   ├── decorators/         # Decoradores de roles y usuario
│   ├── guards/             # Guards de autenticación y autorización
│   ├── interfaces/         # Interfaces de usuario
│   └── enum/              # Enumeraciones de roles
├── client/                 # Módulo de clientes
├── seeds/                  # Datos de prueba
└── transports/            # Configuración gRPC
```

## 🐛 Troubleshooting

### Error: "No se pudo conectar con el servicio de autenticación"
1. Verifica que el servicio de auth esté ejecutándose en `localhost:3003`
2. Confirma que la variable `GRPC_AUTH_URL` esté correctamente configurada
3. Verifica que el puerto 3003 no esté siendo usado por otro servicio

### Error en Seeds
1. Asegúrate de que la base de datos esté ejecutándose
2. Verifica que el servicio de auth esté disponible antes de ejecutar `npm run seed`
3. Los seeds pueden ejecutarse múltiples veces sin problemas (omite duplicados)

### Error de Autenticación en GraphQL
1. Verifica que el token JWT sea válido
2. Asegúrate de incluir el header `Authorization: Bearer TOKEN`
3. Confirma que el usuario tenga los permisos necesarios para la operación

## 📊 Endpoints

- **GraphQL Playground**: `http://localhost:3000/graphql`
- **Health Check**: `http://localhost:3000/auth` (requiere autenticación)

## 🔒 Seguridad

- Todos los endpoints están protegidos con autenticación JWT
- Rate limiting aplicado a todas las operaciones
- Validación de roles en cada operación
- Logs de seguridad para auditoría

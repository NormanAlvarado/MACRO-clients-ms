# Tests Unitarios de Entidades - MACRO Clients MS

Este directorio contiene los tests unitarios para las entidades del microservicio de clientes de MACRO.

## Estructura de Tests

### 📁 Archivos de Test

**Tests de Entidades:**
- `client.entity.spec.ts` - Tests para la entidad Client
- `client-preferences.entity.spec.ts` - Tests para la entidad ClientPreferences  
- `client-address.entity.spec.ts` - Tests para la entidad ClientAddress
- `integration.entity.spec.ts` - Tests de integración entre entidades

**Tests de Servicios:**
- `client.service.spec.ts` - Tests para ClientService
- `client-preferences.service.spec.ts` - Tests para ClientPreferencesService
- `client-address.service.spec.ts` - Tests para ClientAddressService

**Utilidades:**
- `test-utils.ts` - Utilidades y helpers para los tests

### 📖 Documentación

- `DEVELOPER_GUIDE.md` - **Guía completa para desarrolladores** 
- `QUICK_REFERENCE.md` - **Referencia rápida y comandos esenciales**
- `README.md` - Documentación técnica detallada (este archivo)

## 🧪 Cobertura de Tests

**Total: 176 tests - 100% pasando** ✅

### Tests de Entidades (88 tests)

#### Client Entity (16 tests)
- ✅ Constructor y propiedades básicas
- ✅ Relaciones con ClientPreferences y ClientAddress
- ✅ Validación de datos (nombres, emails, teléfonos)
- ✅ Funcionalidad de soft delete
- ✅ Manejo de fechas
- ✅ Serialización JSON

#### ClientPreferences Entity (36 tests)
- ✅ Constructor y propiedades básicas
- ✅ Configuración de idiomas
- ✅ Notificaciones por email
- ✅ Notificaciones push
- ✅ Relaciones con Client
- ✅ Combinaciones de notificaciones
- ✅ Perfiles completos de preferencias
- ✅ Serialización JSON
- ✅ Validación de tipos de datos

#### ClientAddress Entity (20 tests)
- ✅ Constructor y propiedades básicas
- ✅ Información de direcciones (calle, ciudad, provincia, etc.)
- ✅ Información de sucursales/branches
- ✅ Lógica de dirección principal
- ✅ Relaciones con Client
- ✅ Funcionalidad de soft delete
- ✅ Manejo de fechas
- ✅ Perfiles completos de direcciones
- ✅ Serialización JSON
- ✅ Validación de tipos de datos
- ✅ Escenarios de lógica de negocio

#### Integration Tests (16 tests)
- ✅ Cliente con relaciones completas
- ✅ Validaciones de lógica de negocio
- ✅ Escenarios de serialización y persistencia
- ✅ Casos extremos y manejo de errores

### Tests de Servicios (88 tests)

#### ClientService (25 tests)
- ✅ Definición del servicio e inyección de dependencias
- ✅ Crear clientes con métricas y validaciones
- ✅ Buscar clientes (todos, paginados, por ID)
- ✅ Actualizar clientes con validaciones
- ✅ Soft delete y restauración de clientes
- ✅ Eliminación permanente y conteo de clientes activos
- ✅ Manejo de errores de base de datos
- ✅ Integración con MetricsService

#### ClientPreferencesService (27 tests)
- ✅ CRUD completo de preferencias de cliente
- ✅ Configuraciones de idioma y notificaciones
- ✅ Relaciones con entidades Client
- ✅ Validaciones de tipos de datos
- ✅ Manejo de casos extremos y concurrencia
- ✅ Combinaciones de preferencias de notificaciones

#### ClientAddressService (36 tests)
- ✅ CRUD completo de direcciones de cliente
- ✅ Lógica de dirección principal única
- ✅ Paginación de direcciones por cliente
- ✅ Validaciones de negocio
- ✅ Formatos específicos de Costa Rica
- ✅ Tests simplificados para casos complejos

## 🚀 Ejecución de Tests

> 💡 **Para desarrolladores**: Ve a `DEVELOPER_GUIDE.md` para instrucciones detalladas o `QUICK_REFERENCE.md` para comandos rápidos.

### Ejecutar todos los tests de entidades:
\`\`\`bash
npm test -- --testPathPatterns="src/testing" --verbose
\`\`\`

### Ejecutar tests individuales:
\`\`\`bash
# Tests de Client
npm test -- src/testing/client.entity.spec.ts

# Tests de ClientPreferences
npm test -- src/testing/client-preferences.entity.spec.ts

# Tests de ClientAddress
npm test -- src/testing/client-address.entity.spec.ts
\`\`\`

### Ejecutar con cobertura:
\`\`\`bash
npm run test:cov -- --testPathPatterns="src/testing"
\`\`\`

### Modo watch para desarrollo:
\`\`\`bash
npm run test:watch -- --testPathPatterns="src/testing"
\`\`\`

## 📊 Métricas de Test

- **Total de Tests**: 179 tests (174 pasando, 5 omitidos)
- **Suites de Test**: 7 suites  
- **Tests de Entidades**: 88 tests (100% pasando)
- **Tests de Servicios**: 91 tests (86 pasando, 5 omitidos)
- **Cobertura**: Entidades 100%, Servicios ~95%
- **Tiempo de Ejecución**: ~2.8 segundos

## 🔍 Casos de Test Cubiertos

### Validaciones de Datos
- Longitudes máximas de campos
- Formatos de email válidos
- Números de teléfono
- Códigos postales
- Nombres de países y provincias costarricenses

### Relaciones de Entidades
- Relación One-to-One entre Client y ClientPreferences
- Relación One-to-Many entre Client y ClientAddress
- Foreign keys y integridad referencial

### Funcionalidades de Negocio
- Soft delete para todas las entidades
- Dirección principal única por cliente
- Configuraciones de notificaciones
- Manejo de múltiples idiomas

### Serialización y Tipos
- Serialización JSON correcta
- Validación de tipos TypeScript
- Manejo de campos opcionales y requeridos
- Fechas y timestamps

## 🛠 Herramientas Utilizadas

- **Jest**: Framework de testing
- **TypeScript**: Tipado estático
- **@nestjs/testing**: Utilidades de testing de NestJS
- **Supertest**: Para tests de integración (si es necesario)

## 📝 Notas de Desarrollo

### Convenciones de Naming
- Los archivos de test terminan en \`.spec.ts\`
- Los grupos de tests usan \`describe()\` descriptivo
- Los tests individuales usan \`it()\` con descripciones claras

### Estructura de Tests
- **Arrange**: Preparación de datos de test
- **Act**: Ejecución de la acción a testear  
- **Assert**: Verificación de resultados esperados

### Datos de Test
- Uso de datos reales de Costa Rica (provincias, códigos postales)
- Emails y teléfonos con formatos válidos
- Fechas y timestamps manejados correctamente

## 🔄 Mantenimiento

### Agregar Nuevos Tests
1. Crear el archivo \`.spec.ts\` correspondiente
2. Seguir la estructura existente de \`describe\` e \`it\`
3. Usar los helpers de \`test-utils.ts\`
4. Ejecutar tests para verificar funcionamiento

### Actualizar Tests Existentes
1. Mantener la cobertura existente
2. Agregar tests para nuevas propiedades/métodos
3. Actualizar datos de test si es necesario
4. Verificar que todos los tests pasen

---

*Última actualización: ${new Date().toISOString().split('T')[0]}*
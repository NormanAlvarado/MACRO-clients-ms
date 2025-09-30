# Guía de Tests Unitarios para Desarrolladores

## 🚀 Inicio Rápido

### Ejecutar Todos los Tests de Entidades
```bash
npm test -- --testPathPatterns="src/testing"
```

### Ejecutar con Información Detallada
```bash
npm test -- --testPathPatterns="src/testing" --verbose
```

### Ejecutar en Modo Watch (Desarrollo)
```bash
npm run test:watch -- --testPathPatterns="src/testing"
```

## 📋 Comandos Principales

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecuta todos los tests del proyecto |
| `npm run test:cov` | Ejecuta tests con reporte de cobertura |
| `npm run test:watch` | Modo watch para desarrollo |
| `npm run test:debug` | Modo debug para troubleshooting |

## 🎯 ¿Qué Hacen Estos Tests?

### Propósito General
Los tests unitarios de entidades verifican que las **clases de datos** (Client, ClientPreferences, ClientAddress) funcionen correctamente de manera individual y en conjunto.

### ¿Por Qué Son Importantes?
- **Previenen bugs** al cambiar código
- **Documentan** cómo deben comportarse las entidades
- **Facilitan refactoring** con confianza
- **Validan** la lógica de negocio

## 🧪 Tipos de Validaciones

### 1. **Validaciones Básicas** 
```typescript
// Verifica que las propiedades se asignen correctamente
client.nombre = "Juan Pérez";
expect(client.nombre).toBe("Juan Pérez");
```

### 2. **Validaciones de Relaciones**
```typescript
// Verifica que las relaciones entre entidades funcionen
client.preferences = preferences;
expect(client.preferences.cliente_id).toBe(client.id);
```

### 3. **Validaciones de Límites**
```typescript
// Verifica límites de caracteres y formatos
const longName = 'A'.repeat(150); // Máximo permitido
client.nombre = longName;
expect(client.nombre.length).toBe(150);
```

### 4. **Validaciones de Negocio**
```typescript
// Verifica reglas como "solo una dirección principal"
const principalAddresses = addresses.filter(addr => addr.es_principal);
expect(principalAddresses).toHaveLength(1);
```

## 📊 Cobertura Actual

| Entidad | Tests | Áreas Cubiertas |
|---------|-------|-----------------|
| **Client** | 16 | Propiedades, relaciones, soft delete, fechas |
| **ClientPreferences** | 22 | Idiomas, notificaciones, relaciones |
| **ClientAddress** | 32 | Direcciones, sucursales, lógica principal |
| **Integración** | 8 | Relaciones completas, casos reales |

**Total: 88 tests** ✅

## 🛠 Casos de Uso Específicos

### Ejecutar Test de Una Entidad Específica
```bash
# Solo tests de Client
npm test -- src/testing/client.entity.spec.ts

# Solo tests de ClientPreferences  
npm test -- src/testing/client-preferences.entity.spec.ts

# Solo tests de ClientAddress
npm test -- src/testing/client-address.entity.spec.ts

# Solo tests de integración
npm test -- src/testing/integration.entity.spec.ts
```

### Ejecutar Tests con Filtros
```bash
# Tests que contengan "relationship" en el nombre
npm test -- --testNamePattern="relationship"

# Tests que contengan "soft delete"
npm test -- --testNamePattern="soft delete"
```

## 🔍 Interpretando Resultados

### ✅ Test Exitoso
```
✓ should create a client instance (6 ms)
```
- El test pasó correctamente
- Tomó 6 milisegundos en ejecutarse

### ❌ Test Fallido
```
✗ should validate email format (12 ms)
Expected: "valid@email.com"
Received: "invalid-email"
```
- El test falló
- Muestra qué se esperaba vs qué se recibió

### 📈 Resumen Final
```
Test Suites: 4 passed, 4 total
Tests:       88 passed, 88 total
Time:        2.37 s
```
- Todas las suites pasaron
- 88 tests ejecutados exitosamente
- Tiempo total de ejecución

## 🚨 Cuándo Ejecutar Tests

### Durante Desarrollo
- **Antes de commit**: `npm test -- --testPathPatterns="src/testing"`
- **Después de cambios**: Mode watch `npm run test:watch`
- **Antes de PR**: Con cobertura `npm run test:cov`

### En CI/CD
- Los tests se ejecutan automáticamente en cada push
- Deben pasar al 100% para hacer merge

## 🐛 Troubleshooting Común

### Tests Fallan Después de Cambios en Entidades
1. **Revisa** si cambiaste nombres de propiedades
2. **Actualiza** los tests afectados
3. **Verifica** que las relaciones sigan siendo correctas

### Tests Lentos
```bash
# Ejecuta solo un subset para desarrollo rápido
npm test -- src/testing/client.entity.spec.ts --verbose
```

### Error de TypeScript
```bash
# Verifica compilación antes de tests
npm run build
```

## 📝 Agregando Nuevos Tests

### 1. Crear Archivo de Test
```typescript
// nuevo-feature.entity.spec.ts
import { NuevaEntidad } from '../entities/nueva-entidad.entity';

describe('NuevaEntidad', () => {
  let entity: NuevaEntidad;
  
  beforeEach(() => {
    entity = new NuevaEntidad();
  });
  
  it('should create instance', () => {
    expect(entity).toBeDefined();
  });
});
```

### 2. Usar Helpers Existentes
```typescript
import { testUtils } from './test-utils';

const mockData = testUtils.createMockClient();
```

### 3. Seguir Convenciones
- **Nombres descriptivos**: `should validate email format when email is invalid`
- **Arrange-Act-Assert**: Preparar → Ejecutar → Verificar
- **Un concepto por test**: No mezclar múltiples validaciones

## 💡 Tips de Desarrollo

### Desarrollo Iterativo
```bash
# Ejecuta tests en background mientras desarrollas
npm run test:watch -- --testPathPatterns="src/testing"
```

### Debug de Tests
```bash
# Para investigar tests específicos
npm test -- --testNamePattern="should create client" --verbose
```

### Performance
```bash
# Si solo trabajas con una entidad
npm test -- src/testing/client.entity.spec.ts
```

## 📚 Recursos Adicionales

- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **NestJS Testing**: https://docs.nestjs.com/fundamentals/testing
- **TypeORM Testing**: https://typeorm.io/testing

---

## 🎯 Resumen Ejecutivo

**¿Qué son?** Tests que verifican que las entidades funcionen correctamente

**¿Cuándo usarlos?** Antes de commits, durante desarrollo, en CI/CD

**¿Cómo ejecutarlos?** `npm test -- --testPathPatterns="src/testing"`

**¿Qué validan?** Propiedades, relaciones, lógica de negocio, casos límite

**¿Cuánto tardan?** ~2.4 segundos para 88 tests

**¿Cuándo fallan?** Cuando hay cambios que rompen el comportamiento esperado

---

*Para más detalles técnicos, consulta el `README.md` en esta misma carpeta.*
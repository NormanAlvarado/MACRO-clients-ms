# Quick Referen## 🧪 ¿Qué Ve4. **🏢 Negocio**: Solo 1 dirección principal por cliente
5. **🔧 Servicios**: CRUD, métricas, validaciones, manejo de errores

### Ejemplo Visual:ican Estos Tests?

### En 30 Segundos:
Los tests comprueban que las **3 entidades principales** y sus **3 servicios** funcionen correctamente: Entity Tests

## ⚡ Comandos Esenciales

```bash
# Ejecutar todos los tests de entidades
npm test -- --testPathPatterns="src/testing"

# Modo desarrollo (auto-reload)
npm run test:watch -- --testPathPatterns="src/testing"

# Solo una entidad específica
npm test -- src/testing/client.entity.spec.ts
```

## 🎯 ¿Qué Verifican Estos Tests?

### En 30 Segundos:
Los tests comprueban que las **3 entidades principales** (Client, ClientPreferences, ClientAddress) funcionen correctamente:

1. **📝 Propiedades**: Se asignan y leen valores correctamente
2. **🔗 Relaciones**: Vínculos entre Cliente → Preferencias → Direcciones  
3. **📏 Límites**: Máximo 150 caracteres en nombres, emails válidos, etc.
4. **🗑️ Soft Delete**: Marcar como eliminado sin borrar de BD
5. **📅 Fechas**: Creación y registro de timestamps
6. **🏢 Negocio**: Solo 1 dirección principal por cliente

### Ejemplo Visual:
```
Client "Juan Pérez" ✅
├── Preferences (idioma: "es", email: true) ✅  
├── Address Principal (San José, CR) ✅
└── Address Secundaria (Cartago, CR) ✅
```

## 🚨 Cuándo Preocuparse

### ❌ Tests Fallan Si:
- Cambias nombres de propiedades en entidades
- Rompes relaciones entre entidades  
- Excedes límites de caracteres
- Cambias lógica de soft delete
- Modificas reglas de negocio

### ✅ Tests Pasan Si:
- Las entidades mantienen su comportamiento
- Las relaciones siguen funcionando
- Los límites se respetan
- La lógica de negocio es consistente

## 📊 Estado Actual

```
📦 ENTIDADES
✅ Client Entity: 16/16 tests
✅ ClientPreferences: 22/22 tests  
✅ ClientAddress: 32/32 tests
✅ Integration: 8/8 tests

🔧 SERVICIOS  
✅ ClientService: 25/25 tests
✅ ClientPreferencesService: 27/27 tests
⚠️ ClientAddressService: 27/32 tests (5 omitidos)
─────────────────────────────
✅ Total: 174/179 tests (2.8s)
```

## 🛠️ Workflow Típico

```bash
# 1. Haces cambios en una entidad
# 2. Ejecutas tests para verificar
npm test -- src/testing/client.entity.spec.ts

# 3. Si fallan, revisa qué cambió
# 4. Ajusta tests o código según necesidad  
# 5. Ejecuta todos antes de commit
npm test -- --testPathPatterns="src/testing"
```

## 💡 Pro Tips

- **Desarrollo**: Usa `--watch` para tests automáticos
- **Debug**: Usa `--verbose` para más detalles  
- **Específico**: Filtra por archivo para tests rápidos
- **Cobertura**: Usa `test:cov` antes de PR

---

*¿Necesitas más detalles? → Consulta `DEVELOPER_GUIDE.md`*
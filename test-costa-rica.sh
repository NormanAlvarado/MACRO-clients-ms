#!/bin/bash
echo "🇨🇷 Probando la nueva configuración con Costa Rica..."

echo "📍 Consultar una dirección específica:"
curl -s -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ clientAddresses { id calle ciudad estado_provincia pais } }"}' | \
  jq '.data.clientAddresses[0]' 2>/dev/null || echo "Error en la consulta"

echo -e "\n🏢 Crear nueva dirección para probar el default:"
curl -s -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { createClientAddress(createClientAddressInput: { cliente_id: 1, calle: \"Avenida Central 100\", ciudad: \"San José\", estado_provincia: \"San José\", codigo_postal: \"10101\", nombre_sucursal: \"Oficina Prueba\" }) { id pais calle ciudad } }"}' | \
  jq '.data.createClientAddress' 2>/dev/null || echo "Error en la mutación"

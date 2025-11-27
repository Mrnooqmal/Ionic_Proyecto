#!/bin/bash
# Script de prueba de endpoints de familias

BASE_URL="http://localhost:3001/api"

echo "=== PRUEBA DE ENDPOINTS DE FAMILIAS ==="
echo ""

# Test 1: Health Check
echo "1️⃣  TEST HEALTH CHECK"
echo "GET $BASE_URL/health"
curl -s $BASE_URL/health | jq . 2>/dev/null || curl -s $BASE_URL/health
echo ""
echo ""

# Test 2: Obtener familias de paciente
echo "2️⃣  TEST GET FAMILIAS DE PACIENTE"
echo "GET $BASE_URL/familias/1"
curl -s -H "Content-Type: application/json" $BASE_URL/familias/1 | jq . 2>/dev/null || curl -s $BASE_URL/familias/1
echo ""
echo ""

# Test 3: Obtener familia por ID (numeric)
echo "3️⃣  TEST GET FAMILIA POR ID"
echo "GET $BASE_URL/familias/1"
curl -s -H "Content-Type: application/json" $BASE_URL/familias/1 | jq . 2>/dev/null || curl -s $BASE_URL/familias/1
echo ""
echo ""

# Test 4: Crear familia
echo "4️⃣  TEST CREATE FAMILIA"
echo "POST $BASE_URL/familias"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"nombre":"Familia Test","descripcion":"Test","idOwner":1}' \
  $BASE_URL/familias | jq . 2>/dev/null || curl -s -X POST -H "Content-Type: application/json" \
  -d '{"nombre":"Familia Test","descripcion":"Test","idOwner":1}' \
  $BASE_URL/familias
echo ""
echo ""

# Test 5: SSE Connection Test
echo "5️⃣  TEST SSE CONNECTION (será infinite - presiona Ctrl+C para detener)"
echo "GET $BASE_URL/eventos (SSE Stream)"
timeout 5 curl -s -N -H "Accept: text/event-stream" $BASE_URL/eventos || true
echo ""
echo ""

echo "=== FIN DE PRUEBAS ==="

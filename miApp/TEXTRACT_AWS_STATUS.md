# Estado de Integración AWS Textract

## 📋 Resumen Actual

**Estado**: ❌ **NO INTEGRADO** (Versión base64 implementada)

## 🔄 Flujo Actual (v1.0)

### 1. **Cargar Examen** → `cargar-examen.page`
- ✅ Seleccionar consulta
- ✅ Subir archivo (PDF, JPG, PNG)
- ✅ Validación: tipo de archivo y tamaño (máx 10MB)
- ✅ Convertir archivo a **base64**
- ✅ Crear examen en base de datos
- ✅ Guardar BLOB (base64 encoded) en tabla `ConsultaExamen`
- ✅ Preview/resumen antes de guardar

### 2. **Almacenamiento BLOB**
```
Tabla: ConsultaExamen
Campos:
- archivoBlob: LONGBLOB (base64 del archivo)
- archivoNombre: VARCHAR(255)
- archivoTipo: VARCHAR(100) [application/pdf, image/jpeg, image/png]
- archivoSize: INT
- archivoFechaSubida: TIMESTAMP
```

### 3. **Descargar Archivo**
- ✅ GET `/api/consultations/:id/exams/:examId/download`
- ✅ Backend convierte BLOB → Buffer → File
- ✅ Frontend descarga archivo original

## 🚀 Próximas Fases (Roadmap)

### Fase 2: AWS Textract Integration (Futuro)
```typescript
// Pseudocódigo de integración futura
subirConTextractAnalisis() {
  1. Cliente envía base64 al backend
  2. Backend invoca AWS Textract API
  3. Textract analiza documento y retorna:
     - Texto extraído (OCR)
     - Tablas detectadas (structured data)
     - Confianza de detección (%)
  4. Backend procesa resultados y mapea a campos:
     - nombreExamen
     - tipoExamen
     - valores
     - fechaExamen (si detecta fechas)
  5. Guarda análisis de Textract en tabla aparte (TextractAnalysis)
  6. Retorna sugerencias al frontend para validación manual
}
```

### Fase 3: UI/UX Mejorada
- Modal de sugerencias (Textract → usuario)
- Editor para corregir detecciones erróneas
- Confirmación antes de guardar datos extraídos
- Historial de análisis

## 🔧 Implementación Técnica (cuando se integre)

### Backend Changes Required
1. **Dependencia**: `npm install aws-sdk` (o usar AWS Lambda + API Gateway)
2. **Credenciales AWS**: IAM user con permisos `textract:*`
3. **Endpoint nuevo**: `POST /api/consultations/:id/exams/:examId/analyze`
   ```typescript
   router.post('/consultations/:id/exams/:examId/analyze', async (req, res) => {
     // 1. Obtener BLOB de ConsultaExamen
     // 2. Llamar AWS Textract.analyzeDocument()
     // 3. Procesar respuesta
     // 4. Guardar en TextractAnalysis
     // 5. Retornar sugerencias al cliente
   });
   ```

### Frontend Changes Required
1. Nueva página: `examenes/revisar-analisis.page` (después de cargar)
2. Componente: `TextractSuggestions` para mostrar detecciones
3. Botones: "Aceptar", "Rechazar", "Editar valores"
4. Integración en flujo de `cargar-examen`

## 📚 Documentación Útil

### AWS Textract API
- [Documentación oficial](https://docs.aws.amazon.com/textract/)
- Casos de uso: Facturas, recibos, reportes médicos

### Formatos Soportados Actualmente
- ✅ PDF
- ✅ JPEG
- ✅ PNG
- ✅ GIF (convertible a JPEG en backend)

## ⏰ Estimación (cuando se integre)
- **Backend**: 4-6 horas
- **Frontend**: 3-4 horas
- **Testing**: 2-3 horas
- **Total**: ~10-13 horas

## 📝 Notas
- Base64 es temporalmente eficiente para archivos pequeños (<10MB)
- AWS Textract es ideal para **análisis automático** de formatos estructurados (facturas, etc.)
- Para exámenes clínicos simples, análisis manual es aceptable en v1.0

---

**Última actualización**: 2024-NOV-24

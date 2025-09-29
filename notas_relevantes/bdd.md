# 📋 Modelo de Base de Datos Fichas Médicas

Este sistema almacena información clínica de pacientes, consultas, diagnósticos, medicamentos, procedimientos, exámenes y hábitos.  
El diseño sigue una **arquitectura altamente normalizada** con tablas puente para relaciones muchos-a-muchos.

---

## 🏥 Tablas Principales
- **Paciente**: Datos demográficos y de contacto del paciente.  
- **Consulta**: Registro central que conecta con diagnósticos, recetas, exámenes y procedimientos.  
- **ProfesionalSalud**, **ServicioSalud**, **TipoConsulta**: Información del contexto asistencial.  
- **Medicamento**, **Examen**, **Procedimiento**, **DatoClinico**, **Diagnostico**: Catálogos médicos.  

---

## 🔑 Claves
- **PK (Primary Key)**: Generalmente `INT AUTO_INCREMENT`.  
- **FK (Foreign Key)**: Mantienen integridad referencial con `ON DELETE CASCADE` en tablas puente (para evitar registros huérfanos).  
- **Tablas puente**: Usan **PK compuesta** (`idConsulta`, `idExamen`), etc.

---

## 📊 Índices Definidos
- `Paciente(correo)` → **Índice único**: para garantizar unicidad y acelerar búsquedas por correo.  
- `Consulta(fechaIngreso)` → Consultas médicas suelen filtrarse por rangos de fechas.  
- `Receta(fecha)` → Búsqueda rápida de recetas emitidas en un periodo.  
- `Examen(nombreExamen)` → Optimiza búsqueda de exámenes por nombre.  
- `Medicamento(nombreMedicamento)` → Acceso rápido por nombre comercial o genérico.

---

## ⚠️ Consideraciones
1. **Fechas**: `fechaEgreso` debe ser ≥ `fechaIngreso`.  
2. **Valores numéricos**: algunos campos (ej. valores de exámenes) pueden ser `DECIMAL` en lugar de `VARCHAR`.  
3. **Textos largos**: observaciones y descripciones extensas se podrían definir como `TEXT`.  
4. **Optimización**: índices adicionales podrían evaluarse en base a consultas más frecuentes.  
5. **Escalabilidad**: si se espera gran volumen de datos, considerar partición de tablas (ej. `Consulta` por años).  

---

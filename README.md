# Ejercicio 4: API de Plazo Fijo

## Requisitos funcionales

### 1. Gestión de Plazos Fijos

La API debe permitir:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/plazos-fijos` | Crear un plazo fijo |
| GET | `/api/plazos-fijos` | Listar todos los plazos fijos |
| GET | `/api/plazos-fijos/{id}` | Obtener un plazo fijo por ID |
| PUT | `/api/plazos-fijos/{id}` | Actualizar un plazo fijo |
| DELETE | `/api/plazos-fijos/{id}` | Eliminar un plazo fijo |

### 2. Modelo de Plazo Fijo

```json
{
  "id": 1,
  "numeroCuenta": "386-00123-45678",
  "tipoMoneda": "ARS",
  "monto": 100000.00,
  "tasaAnual": 85.50,
  "fechaInicio": "2024-01-15",
  "fechaVencimiento": "2024-04-15",
  "plazoDias": 90,
  "interesCalculado": 21041.10,
  "montoFinal": 121041.10,
  "estado": "ACTIVO"
}
```

### 3. Cálculo de Interés

La API debe calcular automáticamente:
- **Interés = Monto × (Tasa Anual / 365) × Días**
- **Monto Final = Monto + Interés**

**Ejemplo:**
```
Monto: $100.000
Tasa Anual: 85.50%
Días: 90

Interés = 100.000 × (85.50 / 365) × 90 = 21.041,10
Monto Final = 121.041,10
```

### 4. Estados del Plazo Fijo

| Estado | Descripción |
|--------|-------------|
| ACTIVO | Vigente, aún no venció |
| VENCIDO | Ya pasó la fecha de vencimiento |
| CANCELADO | El cliente lo canceló anticipadamente |
| RENOVADO | Se renovó al vencimiento |

### 5. Requisitos técnicos

- **Base de datos**: SQL Server, PostgreSQL o MySQL (el postulante elige)
- **API REST**: JSON
- **Autenticación**: No requerida para este ejercicio
- **Validaciones**:
  - El monto debe ser mayor a 0
  - La tasa anual debe estar entre 1% y 200%
  - La fecha de vencimiento debe ser posterior a la fecha de inicio
  - El plazo en días no puede exceder 365 días

---

## Entregables obligatorios

1. **Código fuente completo** de la aplicación
2. **Script de base de datos** (CREATE TABLE, INSERT de prueba)
3. **Documentación de la API** (endpoints, request/response, códigos de error)
4. **Guía de instalación** paso a paso
5. **Manual de usuario** que explique cómo usar el sistema
6. **Docker** generar todo lo necesario para desplegar mediante contenedores Docker (Dockerfile, docker-compose.yml, etc)

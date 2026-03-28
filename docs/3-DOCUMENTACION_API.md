# Documentación de la API de Plazos Fijos

Esta interfaz proporciona acceso programático para la gestión integral de plazos fijos. Permite a los sistemas cliente crear, consultar, modificar y eliminar registros, delegando los cálculos financieros complejos y las validaciones de negocio al motor de la API.

## Información General
* Ejecutando la API desde el contenedor Docker provisto, se puede acceder desde la **URL Base:** `http://localhost:3000/api/plazos-fijos`
* El **Formato de intercambio** utilizado es: `application/json`
* **Autenticación:** no requerida.

## Glosario de errores comunes

Se utiliza los códigos de estado HTTP estándar para indicar el éxito o fracaso de las peticiones enviadas a la API. 
Se detalla a continuación el set utilizado:
* `200 OK`: Indica que la petición se procesó correctamente.
* `201 Created`: La petición se procesó correctamente y ha creado un nuevo recurso.
* `400 Bad Request`: La petición contiene sintaxis inválida, faltan campos obligatorios o los datos no cumplen con las reglas de negocio (ej. monto negativo, discrepancia de monedas).
* `404 Not Found`: El recurso solicitado (ej. un ID de plazo fijo) no existe en la base de datos.
* `500 Internal Server Error`: Falla inesperada en el servidor, como posible pérdida de conexión con la base de datos.


## Endpoints

### 1. Obtener todos los plazos fijos
Retorna una lista completa de los plazos fijos registrados, incluyendo los cálculos de interés y monto final procesados en tiempo real.

* **Método:** `GET`
* **Ruta:** `/`
* **Respuesta Exitosa (200 OK):**
  ```json
  [
    {
      "id": 1,
      "numeroCuenta": "386-00123-45678",
      "tipoMoneda": "ARS",
      "monto": "100000.00",
      "tasaAnual": "85.50",
      "fechaInicio": "2024-01-15",
      "fechaVencimiento": "2024-04-14",
      "plazoDias": 90,
      "interesCalculado": 21082.20,
      "montoFinal": 121082.20,
      "estado": "ACTIVO"
    }
  ]
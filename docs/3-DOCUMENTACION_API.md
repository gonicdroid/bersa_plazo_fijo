# Documentación de la API de Plazos Fijos

Esta interfaz proporciona acceso programático para la gestión integral de plazos fijos. Permite a los sistemas cliente crear, consultar, modificar y eliminar registros, delegando los cálculos financieros complejos y las validaciones de negocio al motor de la API.

## Información General
* Ejecutando la API desde el contenedor Docker provisto, se puede acceder desde la **URL Base:** `http://localhost:3000/api/plazos-fijos`. Esta ruta base es la que se utiliza en esta documentación como `/`.
* El **Formato de intercambio** utilizado es: `application/json`
* **Autenticación:** no requerida.

## Glosario de códigos HTTP utilizados

Se utiliza los códigos de estado HTTP estándar para indicar el éxito o fracaso de las peticiones enviadas a la API, [como se especifica en la RFC-9205](https://www.rfc-editor.org/rfc/rfc9205.html#name-using-http-status-codes). 
Se detalla a continuación el set utilizado:
* `200 OK`: Indica que la petición se procesó correctamente.
* `201 Created`: La petición se procesó correctamente y ha creado un nuevo recurso.
* `400 Bad Request`: La petición contiene sintaxis inválida, faltan campos obligatorios o los datos no cumplen con las reglas de negocio (ej. monto negativo, discrepancia de monedas).
* `404 Not Found`: El recurso solicitado (ej. un ID de plazo fijo) no existe en la base de datos.
* `500 Internal Server Error`: Falla inesperada en el servidor que no permite responder a la petición de forma correcta.

## Objetos de respuesta

Las respuestas correctas a peticiones GET desde la API devuelven directamente el `objeto` solicitado, o bien un `array de objetos` en caso de ser más de uno, obteniendo el código HTTP 200.

En los casos donde la petición sea de tipo POST o PUT y se devuelva una respuesta exitosa (códigos HTTP 200 o 201), se obtendrá un objeto con la entrada `"message"` indicando un mensaje informativo, y si se ha creado un objeto, también el campo `"id"` del mismo.

Si se ha producido un error general, se devuelve el objeto con la entrada `"error"`, el cual otorga más detalles sobre lo ocurrido, con su respectivo código de error HTTP 500.

Si el error ocurrido es de validación de datos (ya sea por datos faltantes, o bien que no cumplen la lógica de negocio), se devuelve un objeto con la entrada `"error"` indicando el problema, acompañado por el código de error HTTP 400.

Por último, si se solicita un recurso inexistente, se devolverá un objeto con el campo `"message"` indicándolo, con el código de error HTTP 404.


## Endpoints
Se encuentran desarrollados siguiendo la referencia de la [RFC-7231](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3)

### 1. Obtener todos los plazos fijos
Retorna una lista completa de los plazos fijos registrados, con toda la información correspondiente a cada uno.

* **Método:** `GET`
* **Ruta:** `/`
* **Ejemplo de respuesta Exitosa (Código: 200 OK):**
  ```json
  [
    {
      "id": 14,
      "numeroCuenta": "99900001111",
      "tipoMoneda": "USD",
      "monto": "1000.00",
      "tasaAnual": "10.00",
      "fechaInicio": "2026-01-01",
      "fechaVencimiento": "2026-02-01",
      "plazoDias": 31,
      "interesCalculado": 8.5,
      "montoFinal": 1008.5,
      "estado": "ACTIVO"
    },
    {
      "id": 15,
      "numeroCuenta": "3869812345478",
      "tipoMoneda": "USD",
      "monto": "1000.00",
      "tasaAnual": "10.00",
      "fechaInicio": "2026-01-01",
      "fechaVencimiento": "2026-02-01",
      "plazoDias": 31,
      "interesCalculado": 8.5,
      "montoFinal": 1008.5,
      "estado": "ACTIVO"
    }
  ]
  ```

* Errores posibles
  * `Error general`. Código HTTP: 500. Objeto devuelto:
    ```json 
    { "error": "Lo sentimos, ha ocurrido un error." }
    ```
  * `Recurso inexistente`. Código HTTP: 404. Objeto devuelto:
    ```json 
    { "message": "No se encontraron plazos fijos" }
    ```

### 2. Obtener plazo fijo por ID
Retorna el detalle de un único registro financiero.

* **Método:** `GET`
* **Ruta:** `/{id}`
* **Parámetros de ruta:** `id` (numérico, requerido).
* **Ejemplo de respuesta exitosa (Código 200 OK):**
  ```json
    {
      "id": 14,
      "numeroCuenta": "99900001111",
      "tipoMoneda": "USD",
      "monto": "1000.00",
      "tasaAnual": "10.00",
      "fechaInicio": "2026-01-01",
      "fechaVencimiento": "2026-02-01",
      "plazoDias": 31,
      "interesCalculado": 8.5,
      "montoFinal": 1008.5,
      "estado": "ACTIVO"
    }
  ```

* Errores posibles
  * `Error general`. Código HTTP: 500. Objeto devuelto:
    ```json 
    { "error": "Lo sentimos, ha ocurrido un error." }
    ```
  * `Recurso inexistente`. Código HTTP: 404. Objeto devuelto:
    ```json 
    { "message": "No se encontró el plazo fijo" }
    ```
  * `Error de validación`. Código HTTP: 400. Objeto devuelto:
    ```json 
    { "error": "El ID ingresado no es válido." }
    ```

### 3. Crear un plazo fijo
Registra una nueva inversión. El sistema calculará automáticamente los días, intereses e importes finales.
Consulte el [Manual de Usuario](./2-MANUAL_USUARIO.md#plazos-fijos) para obtener información de las reglas de negocio que se deben cumplir.

* **Método:** `POST`
* **Ruta:** `/`
* **Body Request:** todos los campos son requeridos.
    ```json
    {
      "numeroCuenta": "",
      "tipoMoneda": "",
      "monto": "",
      "tasaAnual": "",
      "fechaInicio": "",
      "fechaVencimiento": ""
    }
  ```
* **Ejemplo de Body Request:**
    ```json
    {
      "numeroCuenta": "333012349876",
      "tipoMoneda": "ARS",
      "monto": "200000",
      "tasaAnual": "90",
      "fechaInicio": "2026-01-01",
      "fechaVencimiento": "2026-02-01"
    }
    ```
* **Ejemplo de respuesta exitosa (Código 201 OK):**
    ```json
    {
      "message": "Plazo fijo creado exitosamente",
      "id": 16
    }
    ```

* Errores posibles
  * `Error general`. Código HTTP: 500. Objeto devuelto:
    ```json 
    { "error": "No se pudo crear el plazo fijo." }
    ```
  * `Recurso inexistente`. Código HTTP: 404. Objeto devuelto:
    ```json 
    { "message": "No se encontró el plazo fijo" }
    ```
  * `Error de validación`. Código HTTP: 400. Objetos que puede devolver:
    ```json 
    { "error": "Faltan datos obligatorios." }
    { "error": "El monto debe ser mayor a cero." }
    { "error": "La tasa anual debe ser un valor entre 1 y 200, ambos inclusive." }
    { "error": "El plazo en días debe ser un valor entre 1 y 365, ambos inclusive." }
    { "error": "La moneda especificada no está disponible." }
    { "error": "El número de cuenta debe contener al menos un dígito." }
    { "error": "La moneda de la cuenta no coincide con la moneda del plazo fijo." }
    { "error": "El estado especificado no existe." }
    ```

### 4. Actualizar un plazo fijo
Reemplaza la totalidad de los datos de un registro existente. La petición exige el envío de la entidad completa. El sistema calculará automáticamente los días, intereses e importes finales.
* **Método:** `PUT`
* **Ruta:** `/{id}`
* **Parámetros de ruta:** `id` (numérico, requerido).
* **Body Request:** todos los campos son requeridos.
    ```json
    {
      "numeroCuenta": "",
      "tipoMoneda": "",
      "monto": "",
      "tasaAnual": "",
      "fechaInicio": "",
      "fechaVencimiento": "",
      "estado": ""
    }
    ```
* **Ejemplo de Body Request:**
    ```json
    {
      "numeroCuenta": "333012349876",
      "tipoMoneda": "ARS",
      "monto": "100000",
      "tasaAnual": "90",
      "fechaInicio": "2026-01-01",
      "fechaVencimiento": "2026-02-01",
      "estado": "VENCIDO"
    }
    ```
* **Ejemplo de respuesta exitosa (Código 200 OK):**
    ```json
    {
      "message": "Plazo fijo actualizado exitosamente"
    }
    ```

* Errores posibles
  * `Error general`. Código HTTP: 500. Objeto devuelto:
    ```json 
    { "error": "No se pudo actualizar el plazo fijo." }
    ```
  * `Recurso inexistente`. Código HTTP: 404. Objeto devuelto:
    ```json 
    { "message": "No se encontró el plazo fijo" }
    ```
  * `Error de validación`. Código HTTP: 400. Objetos que puede devolver:
    ```json 
    { "error": "El ID ingresado no es válido." }
    { "error": "Faltan campos obligatorios para actualizar el plazo fijo." }
    { "error": "El monto debe ser mayor a cero." }
    { "error": "La tasa anual debe ser un valor entre 1 y 200, ambos inclusive." }
    { "error": "El plazo en días debe ser un valor entre 1 y 365, ambos inclusive." }
    { "error": "La moneda especificada no está disponible." }
    { "error": "El número de cuenta debe contener al menos un dígito." }
    { "error": "La moneda de la cuenta no coincide con la moneda del plazo fijo." }
    { "error": "El estado especificado no existe." }
    ```

### 5. Eliminar un plazo fijo
Elimina un registro especificado por su ID del sistema.
* **Método:** `DELETE`
* **Ruta:** `/{id}`
* **Parámetros de ruta:** `id` (numérico, requerido).
* **Ejemplo de respuesta exitosa (Código 200 OK):**
    ```json
    {
      "message": "Plazo fijo eliminado exitosamente."
    }
    ```

* Errores posibles
  * `Error general`. Código HTTP: 500. Objeto devuelto:
    ```json 
    { "error": "Lo sentimos, ha ocurrido un error." }
    ```
  * `Recurso inexistente`. Código HTTP: 404. Objeto devuelto:
    ```json 
    { "message": "No se encontró el plazo fijo" }
    ```
  * `Error de validación`. Código HTTP: 400. Objeto devuelto:
    ```json 
    { "error": "El ID ingresado no es válido." }
    ```
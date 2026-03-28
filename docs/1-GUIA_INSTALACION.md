# Guía de Instalación y Despliegue

El proyecto está completamente contenerizado mediante el uso de Docker, garantizando que la base de datos MariaDB y la aplicación Node.js se configuren y comuniquen automáticamente .

## Requisitos previos
* Tener instalado **Docker** y el plugin **Docker Compose** en el sistema anfitrión [(Windows / Linux / Mac).](https://docs.docker.com/get-started/get-docker/)
* Asegurarse de tener libres los puertos `3000` (Aplicación) y `3306` (Base de Datos).

## Pasos de despliegue

1. **Clonar** el repositorio. Desde la terminal, puede utilizar el siguiente comando.
   ```bash
   git clone https://github.com/gonicdroid/bersa_plazo_fijo.git
   ```
2. **Abrir una terminal** en la raíz del proyecto.
3. **Levantar la infraestructura** ejecutando el orquestador en segundo plano:
   ```bash
   docker compose up -d --build
   ```
   *Nota: la primera ejecución tardará varios minutos, ya que Docker construye la imagen de la aplicación, crea la base de datos y ejecuta los scripts para crear las tablas relacionales e insertar los datos maestros (monedas, estados).*
4. **Opcional: verificar los logs.** Puede verificar que todo salió correctamente verificando el estado de los servicios:
   ```bash
   docker compose logs -f
   ```
5. **Utilice el sistema.** Se expone la aplicación en el puerto 3000 de su equipo, de manera local. Puede utilizarlo directamente desde la web accediendo a http://localhost:3000/ o utilizar directamente los diferentes [endpoints](./3-DOCUMENTACION_API.md) con el software de su elección.
6. **Detener el sistema** de forma segura. Utilice el siguiente comando:
   ```bash
   docker compose stop
   ```
   En caso de que quiera destruir los contenedores y la red, ejecute adicionalmente `docker compose down`
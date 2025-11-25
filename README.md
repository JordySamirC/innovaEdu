# InnovaEdu

InnovaEdu es una plataforma educativa full-stack para capacitación docente, que combina un sistema de cursos en línea con herramientas de generación automática de materiales pedagógicos. El frontend está desarrollado en Angular 21 y el backend en Spring Boot 3.3.2 con PostgreSQL.

## Características

- **Frontend (Angular 21)**: Aplicación web responsiva con páginas de inicio, login y registro. Incluye herramientas para generar materiales pedagógicos alineados al Currículo Nacional (CNEB).
- **Backend (Spring Boot 3.3.2)**: API REST con autenticación JWT, gestión de usuarios, cursos y matrículas. Utiliza **Hugging Face API** con el modelo gratuito **Qwen2.5-7B-Instruct** para generar contenido pedagógico personalizado (sesiones de aprendizaje, fichas prácticas, rúbricas, etc.). Incluye exportación a PDF (iText) y DOCX (Apache POI).
- **Base de Datos**: PostgreSQL para persistencia de datos.

## Requisitos

- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)
- **Java** (versión 20)
- **Maven** (versión 3.6 o superior)
- **PostgreSQL** (versión 13 o superior)

## Instalación

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/innovaedu.git
   cd innovaedu
   ```

2. **Configura PostgreSQL** (si usas PostgreSQL):
   - Instala PostgreSQL.
   - Conecta como superusuario (ej. postgres).
   - Crea la BD: `CREATE DATABASE innovaedu;`
   - Usuario: `postgres`, Contraseña: `1984GeorgeOrwell`
   - Si hay errores de esquema, elimina y recrea: `DROP DATABASE innovaedu; CREATE DATABASE innovaedu;`

2. **Configura PostgreSQL**:
   - Instala PostgreSQL si no lo tienes.
   - Crea una base de datos llamada `innovaedu`.
   - Usuario: `postgres`
   - Contraseña: `1984GeorgeOrwell`
   - Puerto: `5432`

   Si usas Docker:
   ```bash
   docker run --name postgres-innovaedu -e POSTGRES_DB=innovaedu -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=1984GeorgeOrwell -p 5432:5432 -d postgres:13
   ```

3. **Instala dependencias del frontend**:
   ```bash
   cd innovaedu-web
   npm install
   cd ..
   ```

4. **Configura el token de Hugging Face**:
   - Crea una cuenta gratuita en [Hugging Face](https://huggingface.co/join)
   - Genera un token de acceso en [Settings > Access Tokens](https://huggingface.co/settings/tokens)
   - Edita `innovaedu-api/src/main/resources/application.properties`
   - Actualiza la línea: `huggingface.api.token=TU_TOKEN_AQUI`

5. **Instala dependencias del backend**:
   ```bash
   cd innovaedu-api
   ./mvnw dependency:resolve  # En Windows: mvnw.cmd dependency:resolve
   cd ..
   ```

## Ejecución

1. **Ejecuta el backend**:
   ```bash
   cd innovaedu-api
   ./mvnw spring-boot:run  # En Windows: mvnw.cmd spring-boot:run
   ```
   - El backend estará disponible en `http://localhost:8080`.
   - API Docs: `http://localhost:8080/swagger-ui.html`

2. **Ejecuta el frontend** (en una terminal separada):
   ```bash
   cd innovaedu-web
   npm start
   ```
   Nota: El frontend usa proxy para redirigir `/api` al backend en desarrollo.
   - El frontend estará disponible en `http://localhost:4200`.
   - El proxy redirige `/api` al backend.

## Uso

- **Página de inicio**: `http://localhost:4200` - Información sobre InnovaEdu y sus características.
- **Registro**: `http://localhost:4200/register` - Crea una nueva cuenta.
- **Login**: `http://localhost:4200/login` - Inicia sesión.
- **API**: Usa herramientas como Postman o la interfaz Swagger para interactuar con los endpoints.

## Estructura del Proyecto

```
innovaedu/
├── innovaedu-api/          # Backend Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── innovaedu-web/          # Frontend Angular
│   ├── src/
│   ├── package.json
│   ├── angular.json
│   └── proxy.conf.json
└── README.md
```

## Desarrollo

- **Frontend**: Usa `npm start` para desarrollo con proxy al backend.
- **Backend**: Usa `mvnw.cmd spring-boot:run` para desarrollo.
- **Linting**: Ejecuta `npm run lint` en `innovaedu-web` para verificar código.
- **Debug**: Usa F12 en el navegador para ver logs en Console y requests en Network.

## Contribución

1. Fork el proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## Contacto

Para preguntas o soporte, abre un issue en GitHub.
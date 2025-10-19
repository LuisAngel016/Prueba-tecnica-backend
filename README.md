# Proyecto API - Express + TypeScript + TypeORM + Swagger

Guía paso a paso para clonar, configurar y ejecutar este proyecto en local (Windows, PowerShell), con y sin Docker.

## Requisitos

- Node.js 18+ (recomendado LTS)
- npm 9+
- Docker Desktop (opcional, para usar Docker Compose)
- PostgreSQL local (opcional si no usas Docker)

## 1) Clonar e instalar dependencias

```powershell
# Clonar el repo
# git clone <URL_DEL_REPO>
# cd prueba-tecnica

# Instalar dependencias
npm install
```

## 2) Configurar API Key de Gemini (Google AI Studio)

Para utilizar las funcionalidades de análisis con IA, necesitas una API key de Google Gemini:

### Pasos para obtener tu API Key:

1. **Accede a Google AI Studio**: Visita [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. **Inicia sesión**: Usa tu cuenta de Google (si no has iniciado sesión)

3. **Crear API Key**:
   - Haz clic en el botón **"Create API Key"** o **"Get API key"**
   - Selecciona un proyecto de Google Cloud existente o crea uno nuevo
   - Se generará automáticamente tu API key

4. **Copiar la API Key**: Copia la clave generada (empieza con `AIza...`)

5. **⚠️ Importante**: 
   - Guarda tu API key en un lugar seguro
   - No la compartas públicamente ni la subas a repositorios
   - El tier gratuito tiene límites de uso (15 requests por minuto)

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=projects_db

# IA Generativa - Gemini API Key
GEMINI_API_KEY=TU_API_KEY_AQUI
```

**Notas**:
- Si usas Docker para la base de datos, mantén `GEMINI_API_KEY` en tu archivo `.env` (no hay servicio `app` en Docker).
- Con Docker (base de datos en contenedor), el puerto publicado es `5433`, así que en `.env` usa `DB_PORT=5433`.


## 3) Ejecutar el proyecto

### Opción A: Con Docker (Recomendado)

Esta opción levanta PostgreSQL en Docker y ejecutas la API en tu máquina con `npm run dev`.

1. **Asegúrate de que Docker Desktop esté corriendo**

2. **Ajusta tu `.env` para usar el puerto publicado por Docker** (5433):
   ```env
   DB_HOST=localhost
   DB_PORT=5433
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=projects_db
   GEMINI_API_KEY=TU_API_KEY_AQUI
   ```
3. Ejecuta los siguientes comandos:
  ```powershell
  # Levantar PostgreSQL en Docker
  docker-compose up -d

  # En otra terminal: iniciar la API en modo desarrollo en tu máquina
  npm run dev

  # (Opcional) Ver logs de PostgreSQL
  docker-compose logs -f db

  # Detener la base de datos (Ctrl+C para detener la API en tu terminal)
  docker-compose down
  ```

4. **Accede a la aplicación**:
   - 🌐 API: http://localhost:3000/api
   - 📚 Swagger UI: http://localhost:3000/api-docs
  - 🗄️ PostgreSQL (Docker): localhost:5433 (user: postgres, pass: postgres, db: projects_db)

### Opción B: Sin Docker (Desarrollo local)

Requiere tener PostgreSQL instalado y corriendo localmente.

1. **Inicia PostgreSQL** localmente y crea la base de datos:
   ```powershell
   # Conéctate a PostgreSQL
   psql -U postgres
   
   # Crea la base de datos
   CREATE DATABASE projects_db;
   ```

2. **Configura el archivo .env** con las credenciales de tu PostgreSQL local

3. **Instala las dependencias** (si no lo hiciste antes):
   ```powershell
   npm install
   ```

4. **Ejecuta el proyecto en modo desarrollo**:
   ```powershell
   npm run dev
   ```

5. **Accede a la aplicación**:
   - 🌐 API: http://localhost:3000/api
   - 📚 Swagger UI: http://localhost:3000/api-docs

### Verificar que todo funciona

Una vez que la aplicación esté corriendo, prueba:

1. **Acceder a Swagger**: http://localhost:3000/api-docs
2. **Crear un proyecto de prueba** usando el endpoint POST /api/projects
3. **Probar el análisis con IA**: GET /api/analisis (requiere GEMINI_API_KEY configurada)

Más detalles sobre Docker en `DOCKER.md`.

## 4) Endpoints principales

### Gestión de Proyectos
- `GET /api/projects` - Listar todos los proyectos activos
- `POST /api/projects` - Crear un nuevo proyecto
- `GET /api/projects/{id}` - Obtener un proyecto específico
- `PATCH /api/projects/{id}` - Actualizar un proyecto
- `DELETE /api/projects/{id}` - Eliminar un proyecto

### Análisis y Gráficos
- `GET /api/analisis` - Generar resumen ejecutivo usando IA de Gemini
  - Modelo por defecto: `gemini-2.5-pro`
  - Requiere `GEMINI_API_KEY` configurada
- `GET /api/graficos` - Obtener datos agregados:
  - Proyectos por estado
  - Proyectos activos vs inactivos
  - Distribución por mes de inicio

📚 **La documentación completa con ejemplos está disponible en Swagger**: http://localhost:3000/api-docs

## 5) Estructura del proyecto

```
src/
  api.routes.ts           # Router raíz agrupando módulos bajo /api
  app.ts                  # App Express, middlewares, Swagger
  index.ts                # Bootstrap: DB + server
  db.ts                   # Configuración TypeORM (DataSource)
  swagger.ts              # Configuración Swagger (UI + JSON)
  utils/
    validator.ts          # Helper para validar DTOs (class-validator)
  projects/
    project.controller.ts
    routes/
      project.routes.ts   # Rutas con bloques @swagger
    dto/
      create-project.dto.ts
      update-project.dto.ts
    entities/
      project.entity.ts
```

## 6) Migraciones y sincronización

Actualmente TypeORM usa `synchronize: true` en `src/db.ts`, por lo que crea/actualiza tablas automáticamente durante el desarrollo. Para producción, se recomienda desactivar `synchronize` y usar migraciones.

## 7) Scripts útiles

- `npm run dev` – modo desarrollo con autoreload
- `npm run build` – compilar TypeScript a `dist/`
- `npm start` – ejecutar `dist/index.js`

---

¿Dudas o sugerencias? Abre un issue o envía un PR. ¡Feliz coding!

# Guía rápida: Docker + API local

Este proyecto usa Docker solo para la base de datos PostgreSQL. La API (Express + TypeScript) se ejecuta localmente con `npm run dev`.

## Servicios

- db (PostgreSQL 14): expone puerto host 5433 -> contenedor 5432

## Preparación

1) Crea `.env` en la raíz:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=projects_db
GEMINI_API_KEY=TU_API_KEY_AQUI
```

2) Instala dependencias

```powershell
npm install
```

## Levantar entorno

```powershell
# Levantar PostgreSQL en Docker
docker-compose up -d

# Iniciar la API en tu máquina (otra terminal)
npm run dev
```

- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api-docs
- PostgreSQL: localhost:5433 (postgres/postgres)

## Logs y mantenimiento

```powershell
# Ver logs de la base de datos
docker-compose logs -f db

# Detener y limpiar
docker-compose down
```

## Notas
- No hay servicio `app` en `docker-compose.yml`. La API corre fuera del contenedor.
- Si prefieres dockerizar también la app, habría que añadir un servicio `app` al compose con su Dockerfile.
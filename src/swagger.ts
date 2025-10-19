import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express, Request, Response } from "express";

const definition = {
  openapi: "3.0.3",
  info: {
    title: "Proyecto API",
    version: "1.0.0",
    description: "Documentación de la API Proyecto usando Swagger",
  },
  tags: [
    { name: "Projects", description: "Operaciones sobre proyectos" },
    { name: "Graphics", description: "Datos agregados para gráficos" },
    { name: "Analysis", description: "Análisis con IA generativa" }
  ],
};

const options = {
  definition,
  // Escanear todo src por bloques @swagger
  apis: [
    "./src/**/*.ts",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  // JSON (útil para verificar que Swagger cargó correctamente)
  app.get("/api-docs.json", (_req: Request, res: Response) => res.json(swaggerSpec));
  // UI (Express 5): servir assets y responder a GET explícito
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(swaggerSpec));
  console.log("Swagger listo: UI=/api-docs, JSON=/api-docs.json");
}

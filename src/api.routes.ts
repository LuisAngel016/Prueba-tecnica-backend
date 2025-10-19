import { Router } from "express";
import projectRouter from "./projects/routes/project.routes";
import graphicsRouter from "./graphics/routes/graphics.routes";
import analysisRouter from "./analysis/routes/analysis.routes";

const apiRouter = Router();

// Las rutas de proyectos ya incluyen el prefijo "/projects" internamente
apiRouter.use(projectRouter);
apiRouter.use(graphicsRouter);
apiRouter.use(analysisRouter);

export default apiRouter;

import { Router } from "express";
import { GraphicsController } from "../graphics.controller";

const graphicsController = new GraphicsController();
const router = Router();

/**
 * @swagger
 * /graficos:
 *   get:
 *     summary: Obtiene datos agregados para gráficos
 *     tags: [Graphics]
 *     responses:
 *       200:
 *         description: Datos agregados de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 10
 *                 byState:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       state:
 *                         type: string
 *                         example: "En progreso"
 *                       count:
 *                         type: number
 *                         example: 5
 *                 byStatus:
 *                   type: object
 *                   properties:
 *                     active:
 *                       type: number
 *                       example: 8
 *                     inactive:
 *                       type: number
 *                       example: 2
 *                 byMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2025-01"
 *                       count:
 *                         type: number
 *                         example: 3
 *       500:
 *         description: Error del servidor
 */
router.get("/graphics", (req, res) => graphicsController.getGraphicsData(req, res));

export default router;

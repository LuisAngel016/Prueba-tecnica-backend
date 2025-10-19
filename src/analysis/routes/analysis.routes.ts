import { Router } from "express";
import { AnalysisController } from "../analysis.controller";

const analysisController = new AnalysisController();
const router = Router();

/**
 * @swagger
 * /analisis:
 *   get:
 *     summary: Genera un resumen de las descripciones de proyectos usando IA
 *     tags: [Analysis]
 *     parameters:
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Modelo de Gemini a utilizar (por defecto gemini-1.5-flash)
 *     responses:
 *       200:
 *         description: Resumen generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                   example: "Resumen ejecutivo de los proyectos..."
 *                 projectCount:
 *                   type: number
 *                   example: 10
 *                 method:
 *                   type: string
 *                   example: "ai-gemini"
 *                   description: Método usado (ai-gemini, basic, basic-fallback)
 *                 note:
 *                   type: string
 *                   example: "Para usar IA generativa (Gemini), configura GEMINI_API_KEY"
 *       500:
 *         description: Error del servidor
 */
router.get("/analysis", (req, res) => analysisController.generateSummary(req, res));

export default router;

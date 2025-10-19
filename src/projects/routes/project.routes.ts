import { Router } from "express";
import { ProjectController } from "../project.controller";

const projectController = new ProjectController();

const router = Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Obtiene todos los proyectos
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *             example:
 *               - id: "8d7f1f6e-2f61-4a2c-9c3a-3c2a7a9c1a11"
 *                 name: "Proyecto A"
 *                 description: "Descripción A"
 *                 state: "En progreso"
 *                 active: true
 *                 startDate: "2025-01-01 19:00:00"
 *                 endDate: "2025-06-30 19:00:00"
 *                 createdAt: "2025-01-01T10:00:00.000Z"
 *                 updatedAt: "2025-01-02T12:00:00.000Z"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/projects", (req, res) => projectController.getAllProjects(req, res));

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crea un nuevo proyecto
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectDto'
 *           example:
 *             name: "Proyecto web"
 *             description: "Desarrollo de una nueva plataforma web con arquitectura limpia"
 *             state: "En progreso"
 *             startDate: "2025-10-20"
 *             endDate: "2026-04-20"
 *     responses:
 *       201:
 *         description: Proyecto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *             example:
 *               id: "b281062c-cfcd-4a43-9c4f-bf7cca5a982b"
 *               name: "Proyecto web"
 *               description: "Desarrollo de una nueva plataforma web con arquitectura limpia"
 *               state: "En progreso"
 *               active: true
 *               startDate: "2025-10-20T00:00:00.000Z"
 *               endDate: "2026-04-20T00:00:00.000Z"
 *               createdAt: "2025-10-19T18:45:27.150Z"
 *               updatedAt: "2025-10-19T18:45:27.150Z"
 *       409:
 *         description: Conflicto de duplicado (name único)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
router.post("/projects", (req, res) => projectController.createProject(req, res));

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Obtiene un proyecto por ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           pattern: '^[0-9a-fA-F-]{36}$'
 *         required: true
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID inválido (no UUID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
router.get("/projects/:id", (req, res) => projectController.getProjectById(req, res));

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Actualiza un proyecto por ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           pattern: '^[0-9a-fA-F-]{36}$'
 *         required: true
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectDto'
 *           example:
 *             name: "Proyecto actualizado"
 *             description: "Descripción actualizada"
 *             state: "Completado"
 *             startDate: "2025-02-01"
 *             endDate: "2025-11-30"
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *             example:
 *               id: "b281062c-cfcd-4a43-9c4f-bf7cca5a982b"
 *               name: "Proyecto actualizado"
 *               description: "Descripción actualizada"
 *               state: "Completado"
 *               active: true
 *               startDate: "2025-02-01T00:00:00.000Z"
 *               endDate: "2025-11-30T00:00:00.000Z"
 *               createdAt: "2025-10-19T18:45:27.150Z"
 *               updatedAt: "2025-10-19T20:30:15.250Z"
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID inválido (no UUID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
router.patch("/projects/:id", (req, res) => projectController.updateProject(req, res));

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Elimina un proyecto por ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           pattern: '^[0-9a-fA-F-]{36}$'
 *         required: true
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Proyecto eliminado exitosamente'
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID inválido (no UUID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 */
router.delete("/projects/:id", (req, res) => projectController.deleteProject(req, res));

export default router;

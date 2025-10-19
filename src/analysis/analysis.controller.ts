import { Request, Response } from "express";
import { Project } from "../projects/entities/project.entity";
import axios from "axios"; // ⚙️ Asegúrate de instalarlo: npm install axios

export class AnalysisController {
    async generateSummary(req: Request, res: Response) {
        try {
            const projects = await Project.find({ where: { active: true } });

            if (projects.length === 0) {
                return res.json({
                    summary: "No hay proyectos para analizar.",
                    projectCount: 0,
                });
            }

            // 🔹 Concatenar todas las descripciones
            const descriptions = projects
                .map((p, i) => `Proyecto ${i + 1} (${p.name}): ${p.description}`)
                .join("\n");

            const prompt = `
Analiza las siguientes descripciones de proyectos y genera un resumen ejecutivo en español que incluya:
1. Temas principales
2. Patrones comunes
3. Áreas de enfoque
4. Recomendaciones breves

Descripciones:
${descriptions}
`;

            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
                const summary = this.generateBasicSummary(projects);
                return res.json({
                    summary,
                    projectCount: projects.length,
                    method: "basic",
                    note: "Configura GEMINI_API_KEY para usar IA (Gemini)",
                });
            }

            // ✅ Llamada directa al endpoint de Gemini AI Studio usando Axios
            const model = "gemini-2.5-pro";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

            try {
                const { data } = await axios.post(
                    url,
                    {
                        contents: [
                            {
                                parts: [{ text: prompt }],
                            },
                        ],
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "x-goog-api-key": apiKey,
                        },
                    }
                );

                // Extraer texto generado
                const aiSummary =
                    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                    "No se recibió contenido de IA.";

                return res.json({
                    summary: aiSummary,
                    projectCount: projects.length,
                    method: "ai-gemini-axios",
                    model,
                });
            } catch (err: any) {
                console.error("❌ Error al llamar a Gemini API:", err.response?.data || err.message);

                const summary = this.generateBasicSummary(projects);
                return res.json({
                    summary,
                    projectCount: projects.length,
                    method: "basic-fallback",
                    error:
                        err.response?.data?.error?.message ||
                        "Error desconocido al usar Gemini API",
                });
            }
        } catch (error: any) {
            res.status(500).json({
                error: "Error al generar análisis",
                message: error.message,
            });
        }
    }

    private generateBasicSummary(projects: any[]): string {
        const states = new Set(projects.map((p) => p.state));
        const activeCount = projects.filter((p) => p.active).length;

        return `Resumen de ${projects.length} proyectos:
- Estados: ${Array.from(states).join(", ")}
- Proyectos activos: ${activeCount}
- Proyectos inactivos: ${projects.length - activeCount}
- Proyectos más recientes: ${projects
                .slice(0, 3)
                .map((p) => p.name)
                .join(", ")}`;
    }
}

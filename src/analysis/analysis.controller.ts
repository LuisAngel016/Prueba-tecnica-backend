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

            // ✅ Llamada al endpoint de Gemini con reintentos (backoff exponencial)
            const model = "gemini-2.5-pro";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

            const result = await this.callGeminiWithRetries({ url, prompt, apiKey, model, maxAttempts: 3 });

            if (result.success) {
                const data = result.data;
                const aiSummary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se recibió contenido de IA.";
                return res.json({
                    summary: aiSummary,
                    projectCount: projects.length,
                    method: "ai-gemini-axios",
                    model,
                });
            }

            // Fallback básico con información del error final
            console.warn("⚠️ Gemini fallback después de reintentos:", result.error);
            const summary = this.generateBasicSummary(projects);
            return res.json({
                summary,
                projectCount: projects.length,
                method: "basic-fallback",
                error: result.error || "Error desconocido al usar Gemini API",
            });
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

    // Llamada a Gemini con reintentos y backoff exponencial
    private async callGeminiWithRetries(opts: {
        url: string;
        prompt: string;
        apiKey: string;
        model: string;
        maxAttempts?: number;
    }): Promise<{ success: boolean; data?: any; error?: string }> {
        const { url, prompt, apiKey, maxAttempts = 3 } = opts;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const { data } = await axios.post(
                    url,
                    { contents: [{ parts: [{ text: prompt }] }] },
                    { headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey } }
                );
                return { success: true, data };
            } catch (err: any) {
                const status = err.response?.status;
                const message = err.response?.data?.error?.message || err.message || String(err);

                // Determinar si se debe reintentar: errores de servidor (5xx), 429 (rate limit) o errores de red
                const shouldRetry = !err.response || (status >= 500) || status === 429 || /overload|overloaded/i.test(message);

                // Si es el último intento o no es reintentable, devolver error
                if (attempt === maxAttempts || !shouldRetry) {
                    return { success: false, error: message };
                }

                // Backoff exponencial (ej: 500ms, 1000ms, 2000ms...)
                const delay = Math.pow(2, attempt - 1) * 500;
                console.warn(`Intento ${attempt} falló (status=${status}). Reintentando en ${delay}ms... - ${message}`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        return { success: false, error: 'Error desconocido al llamar a Gemini' };
    }
}

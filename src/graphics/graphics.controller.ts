import { Request, Response } from "express";
import { Project } from "../projects/entities/project.entity";

export class GraphicsController {
    async getGraphicsData(req: Request, res: Response) {
        try {
            // Ejecutar consultas agregadas directamente en la DB para optimizar
            const [stateRows, statusRow] = await Promise.all([
                // Conteo por estado
                Project.createQueryBuilder('p')
                    .where('p.active = true')
                    .select("COALESCE(p.state, 'Sin estado')", 'state')
                    .addSelect('COUNT(*)', 'count')
                    .groupBy("COALESCE(p.state, 'Sin estado')")
                    .orderBy('state', 'ASC')
                    .getRawMany<{ state: string; count: string }>(),
                    
                    // Conteo activos/inactivos y total
                    Project.createQueryBuilder('p')
                    .select("SUM(CASE WHEN p.active = true THEN 1 ELSE 0 END)", 'active')
                    .addSelect("SUM(CASE WHEN p.active = false THEN 1 ELSE 0 END)", 'inactive')
                    .addSelect('COUNT(*)', 'total')
                    .getRawOne<{ active: string; inactive: string; total: string }>(),
            ]);

            const toInt = (v: string | number | null | undefined) => (v == null ? 0 : typeof v === 'string' ? parseInt(v, 10) : v);

            res.json({
                total: toInt(statusRow?.total),
                byState: stateRows.map(r => ({ state: r.state, count: toInt(r.count) })),
                byStatus: {
                    active: toInt(statusRow?.active),
                    inactive: toInt(statusRow?.inactive),
                },
            });
        } catch (error: any) {
            res.status(500).json({
                error: 'Error al generar datos para gráficos',
                message: error.message
            });
        }
    }
}

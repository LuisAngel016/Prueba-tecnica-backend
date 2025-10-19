import { IsOptional, IsString, IsDateString } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProjectDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del proyecto
 *         description:
 *           type: string
 *           description: Descripción del proyecto
 *         state:
 *           type: string
 *           description: Estado del proyecto
 *         startDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio (YYYY-MM-DD)
 *         endDate:
 *           type: string
 *           format: date
 *           description: Fecha de fin (YYYY-MM-DD)
 *       example:
 *         name: "Proyecto actualizado"
 *         description: "Descripción actualizada"
 *         state: "Completado"
 *         startDate: "2025-02-01 19:00:00"
 *         endDate: "2025-11-30 19:00:00"
 */


export class UpdateProjectDto {
    @IsOptional()
    @IsString({ message: 'El campo "name" debe ser un string' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'El campo "description" debe ser un string' })
    description?: string;

    @IsOptional()
    @IsString({ message: 'El campo "state" debe ser un string' })
    state?: string;

    @IsOptional()
    @IsDateString({}, { message: 'El campo "startDate" debe ser una fecha válida (formato: YYYY-MM-DD)' })
    startDate?: Date;

    @IsOptional()
    @IsDateString({}, { message: 'El campo "endDate" debe ser una fecha válida (formato: YYYY-MM-DD)' })
    endDate?: Date;
}

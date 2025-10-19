import { IsNotEmpty, IsString, IsDateString, IsOptional } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProjectDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - startDate
 *         - endDate
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del proyecto (único)
 *         description:
 *           type: string
 *           description: Descripción del proyecto
 *         state:
 *           type: string
 *           description: Estado del proyecto (por defecto "En progreso")
 *         startDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio (YYYY-MM-DD)
 *         endDate:
 *           type: string
 *           format: date
 *           description: Fecha de fin (YYYY-MM-DD)
 *       example:
 *         name: "Proyecto creado"
 *         description: "Descripción creada"
 *         state: "En progreso"
 *         startDate: "2025-02-01 19:00:00"
 *         endDate: "2025-11-30 19:00:00"
 */
export class CreateProjectDto {
    @IsNotEmpty({ message: 'El campo "name" es requerido' })
    @IsString({ message: 'El campo "name" debe ser un string' })
    name: string;

    @IsNotEmpty({ message: 'El campo "description" es requerido' })
    @IsString({ message: 'El campo "description" debe ser un string' })
    description: string;

    @IsOptional()
    @IsString({ message: 'El campo "state" debe ser un string' })
    state?: string;

    @IsNotEmpty({ message: 'El campo "startDate" es requerido' })
    @IsDateString({}, { message: 'El campo "startDate" debe ser una fecha válida (formato: YYYY-MM-DD)' })
    startDate: Date;

    @IsNotEmpty({ message: 'El campo "endDate" es requerido' })
    @IsDateString({}, { message: 'El campo "endDate" debe ser una fecha válida (formato: YYYY-MM-DD)' })
    endDate: Date;
}

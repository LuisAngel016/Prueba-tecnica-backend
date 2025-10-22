import { Request, Response } from "express";
import { isUUID } from "class-validator";
import { Project } from "./entities/project.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { validateDto } from "../utils/validator";


export class ProjectController {
    async getAllProjects(req: Request, res: Response) {
        try {
            const projects = await Project.findBy({ active: true });
            res.json({
                results: projects,
                total: projects.length
            });
        } catch (error: any) {
            res.status(500).json({
                error: 'Error al obtener proyectos',
                message: error.message
            });
        }
    }

    async createProject(req: Request, res: Response) {
        try {
            const createProjectDto = await validateDto(CreateProjectDto, req.body);
            
            // Validar fechas
            const dateValidation = this.validateDates(createProjectDto.startDate, createProjectDto.endDate);
            if (!dateValidation.valid) {
                return res.status(400).json({
                    error: 'Validación de fechas',
                    message: dateValidation.message
                });
            }

            // Intentar reactivar si existe un duplicado inactivo por nombre
            const reactivated = await this.reactivateIfInactiveDuplicate(createProjectDto);
            if (reactivated) {
                return res.status(200).json(reactivated);
            }

            // Crear nuevo proyecto si no existe
            const project = Project.create({
                ...createProjectDto
            });
            await project.save();
            res.status(201).json(project);
        } catch (error: any) {
            this.handleDBExceptions(error, res);
        }
    }

    async getProjectById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const project = await this.findProjectById(id, res);
            if (!project) return;
            
            res.json(project);
        } catch (error: any) {
            res.status(500).json({
                error: 'Error al obtener proyecto',
                message: error.message
            });
        }
    }

    async updateProject(req: Request, res: Response) {
        const { id } = req.params;
        try {
            // Permitir editar también proyectos inactivos (para reactivarlos)
            const project = await Project.findOne({ where: { id } });
            if (!project) {
                return res.status(404).json({
                    error: 'Proyecto no encontrado',
                    message: `No se encontró un proyecto con el ID: ${id}`
                });
            }

            const updateProjectDto = await validateDto(UpdateProjectDto, req.body);

            // Si se proporciona un nombre, validar que no exista otro proyecto (activo o inactivo) con el mismo nombre
            if (updateProjectDto.name) {
                const existingByName = await Project.findOne({ where: { name: updateProjectDto.name } });
                if (existingByName && existingByName.id !== id) {
                    // Si existe otro proyecto con el mismo nombre y está activo -> conflicto
                    if (existingByName.active) {
                        return res.status(409).json({
                            error: 'Conflicto de duplicado',
                            message: 'Ya existe un proyecto activo con ese nombre'
                        });
                    }

                    // Si existe otro proyecto con el mismo nombre pero INACTIVO -> reactivarlo (igual que en create)
                    existingByName.active = true;
                    // Usar las fechas provistas en el payload cuando estén, si no mantener las existentes
                    existingByName.startDate = updateProjectDto.startDate || existingByName.startDate;
                    existingByName.endDate = updateProjectDto.endDate || existingByName.endDate;
                    if (updateProjectDto.state) {
                        existingByName.state = updateProjectDto.state;
                    }
                    // No sobrescribimos el nombre porque ya coincide
                    await existingByName.save();
                    return res.status(200).json(existingByName);
                }
            }

            // Calcular fechas efectivas a validar
            const effectiveStart = updateProjectDto.startDate || project.startDate;
            const effectiveEnd = updateProjectDto.endDate || project.endDate;

            const dateValidation = this.validateDates(effectiveStart, effectiveEnd);
            if (!dateValidation.valid) {
                return res.status(400).json({
                    error: 'Validación de fechas',
                    message: dateValidation.message
                });
            }

            this.applyUpdateConsideringInactive(project, updateProjectDto, effectiveStart, effectiveEnd);

            await project.save();
            await project.reload(); // Recarga la instancia actual desde la DB
            res.json(project);
        } catch (error: any) {
            this.handleDBExceptions(error, res);
        }
    }

    async deleteProject(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const project = await this.findProjectById(id, res);
            if (!project) return;
            
            await Project.update({ id }, { active: false });
            
            res.status(200).json({
                message: 'Proyecto eliminado exitosamente',
                project
            });
        } catch (error: any) {
            this.handleDBExceptions(error, res);
        }
    }

    private async findProjectById(id: string, res: Response): Promise<Project | null> {
        if (!isUUID(id)) {
            res.status(400).json({
                error: 'ID inválido',
                message: 'El ID proporcionado no tiene un formato UUID válido'
            });
            return null;
        }
        const project = await Project.findOne({ where: { id, active: true } });
        if (!project) {
            res.status(404).json({
                error: 'Proyecto no encontrado',
                message: `No se encontró un proyecto con el ID: ${id}`
            });
            return null;
        }
        return project;
    }

    
    // Reactiva un proyecto inactivo si existe uno con el mismo nombre.
    // Si hay un proyecto activo con ese nombre, lanza un error con statusCode 409.
    private async reactivateIfInactiveDuplicate(createProjectDto: CreateProjectDto): Promise<Project | undefined> {
        const existingByName = await Project.findOne({ where: { name: createProjectDto.name } });
        if (!existingByName) return undefined;

        if (!existingByName.active) {
            existingByName.active = true;
            existingByName.startDate = createProjectDto.startDate;
            existingByName.endDate = createProjectDto.endDate;
            if (createProjectDto.state) {
                existingByName.state = createProjectDto.state;
            }
            await existingByName.save();
            return existingByName;
        }

        // Ya activo -> conflicto de duplicado
        throw {
            statusCode: 409,
            message: 'Ya existe un proyecto activo con ese nombre',
        };
    }

    // Aplica actualización considerando si el proyecto estaba inactivo: reactivar y
    // actualizar SOLO active, fechas y state; si estaba activo, aplicar cambios normalmente.
    private applyUpdateConsideringInactive(
        project: Project,
        updateProjectDto: UpdateProjectDto,
        effectiveStart: Date,
        effectiveEnd: Date
    ): void {
        if (!project.active) {
            project.active = true;
            // Solo actualizar fechas si fueron provistas en el payload
            // También permitir actualizar el nombre al reactivar si viene en el payload
            if (updateProjectDto.name) {
                project.name = updateProjectDto.name;
            }
            if (updateProjectDto.startDate) {
                project.startDate = effectiveStart;
            }
            if (updateProjectDto.endDate) {
                project.endDate = effectiveEnd;
            }
            if (updateProjectDto.state) {
                project.state = updateProjectDto.state;
            }
            return;
        }

        Object.assign(project, updateProjectDto);
    }

    private validateDates(startDate: Date, endDate: Date): { valid: boolean; message?: string } {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end < start) {
            return {
                valid: false,
                message: 'La fecha de fin no puede ser anterior a la fecha de inicio'
            };
        }
        
        return { valid: true };
    }

    private handleDBExceptions(error: any, res: Response) {
        // Error de duplicado (PostgreSQL unique constraint)
        if (error.code === '23505') {
            return res.status(409).json({
                error: 'Conflicto de duplicado',
                message: error.detail || 'Ya existe un proyecto con ese nombre'
            });
        }

        // Error de validación con statusCode
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || 'Error en la operación',
            details: error.details || undefined
        });

        // Log de errores del servidor
        if (statusCode === 500) {
            console.error('Error del servidor:', error);
        }
    }
}
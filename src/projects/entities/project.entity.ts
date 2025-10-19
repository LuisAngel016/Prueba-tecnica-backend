import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del proyecto
 *         name:
 *           type: string
 *           description: Nombre del proyecto
 *         description:
 *           type: string
 *           description: Descripción del proyecto
 *         state:
 *           type: string
 *           description: Estado del proyecto
 *         active:
 *           type: boolean
 *           description: Si el proyecto está activo
 *         startDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio
 *         endDate:
 *           type: string
 *           format: date
 *           description: Fecha de fin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de actualización
 *       example:
 *         id: "8d7f1f6e-2f61-4a2c-9c3a-3c2a7a9c1a11"
 *         name: "Proyecto A"
 *         description: "Descripción A"
 *         state: "En progreso"
 *         active: true
 *         startDate: "2025-01-01 19:00:00"
 *         endDate: "2025-06-30 19:00:00"
 *         createdAt: "2025-01-01T10:00:00.000Z"
 *         updatedAt: "2025-01-02T12:00:00.000Z"
 */


@Entity('projects')
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ unique: true, nullable: false })
    name: string;

    @Column()
    description: string;

    @Column({ default: 'En progreso' })
    state: string;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: false })
    startDate: Date;

    @Column({ nullable: false })
    endDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

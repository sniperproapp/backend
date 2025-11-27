
import { ProductsMenbresia } from 'src/productos_membresias/ProductsMenbresia.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
 
 

@Entity('planes_membresia')
export class PlanMembresia {
    
    // Campo Principal
    @PrimaryGeneratedColumn()
    id_plan: number;

    // Campos de Definición del Plan
    @Column()
    nombre_plan: string;

    @Column()
    recurrencia: 'Mensual' | 'Trimestral' | 'Anual';

    @Column()
    nivel_acceso: string; // Ej: 'Premium', 'Básico'

    @Column('text')
    descripcion_beneficios: string;


    // RELACIONES

    // 1. RELACIÓN One-to-One con Producto (El plan es un detalle del producto vendido)
    // El id_producto se usará como clave foránea en esta tabla.
    @OneToOne(() => ProductsMenbresia, producto => producto.plan)
    @JoinColumn({ name: 'id_producto' })
    producto: ProductsMenbresia;

    // 2. RELACIÓN One-to-Many con SuscripcionActiva (Muchas suscripciones usan este plan)
    // @OneToMany(() => SuscripcionActiva, suscripcion => suscripcion.plan)
    // suscripciones: SuscripcionActiva[];
}
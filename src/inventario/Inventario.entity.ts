import { ProductsMenbresia } from "src/productos_membresias/ProductsMenbresia.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";

// -- 7. INVENTARIO (Control de stock)
@Entity('inventario')
export class Inventario {
    @PrimaryGeneratedColumn()
    id_inventario: number;

    @Column()
    cantidad_stock: number;
    
    // Relación 1:1 (el lado mapeado)
    @OneToOne(() => ProductsMenbresia, producto => producto.inventario)
    @JoinColumn({ name: 'id_producto' })
    producto: ProductsMenbresia;
}
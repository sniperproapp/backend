 
import { Inventario } from "../inventario/Inventario.entity";
import { PlanMembresia } from "../membresias/Membresias.entity";
 
 
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'ProductsMenbresia'})
export class ProductsMenbresia{

   @PrimaryGeneratedColumn()
    id_producto: number;

    @Column()
    name:string;
   
    @Column({nullable: true})
    estad:number;
   
    @Column()
    description:string;

    
  
   
    @Column({nullable: true})
    image1:string;
   
   
    
   
   
    @Column({type: "decimal", precision: 20, scale: 10,default:0})
    price:number;

    
    
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

  @Column()
    tipo_articulo: 'Fisico' | 'Ebook' | 'Membresia'; // Clave para la lógica

    // RELACIÓN: Un producto tiene muchas líneas de detalle de órdenes.
    // @OneToMany(() => DetalleOrden, detalle => detalle.producto)
    // detallesOrden: DetalleOrden[];

    // RELACIÓN: Un producto de tipo 'Membresía' tiene los detalles del plan.
    // Usamos OneToOne y JoinColumn para vincular la definición del plan.
    @OneToOne(() => PlanMembresia, plan => plan.producto)
     
    plan: PlanMembresia;

    // 1:1 con el inventario (si tipo_articulo = 'Físico')
    @OneToOne(() => Inventario, inventario => inventario.producto,{
    cascade: true, 
    onDelete: 'CASCADE' // Opcional: si borras el Yate, borras los Detalles.
  })
  
    inventario: Inventario;
}
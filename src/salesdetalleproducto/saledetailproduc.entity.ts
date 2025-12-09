 
import { Cursos } from "src/cursos/Cursos.entity";
import { ProductsMenbresia } from "src/productos_membresias/ProductsMenbresia.entity";
import { Sale } from "src/sale/sale.entity";
import { Saleproducto } from "src/sales_producto/saleproducto.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'sale_detail_produc'})
export class Saledetailproduc{

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    type_discount:number;

    @Column()
    discount:number; 
    
    @Column()
    campaign_discount:number;


    @Column({nullable: true})
    code_cupon:string;

    @Column()
    code_discount:string;


    @Column()
    price_unit:number;
   
    @Column()
    subtotal:number;
   
    @Column()
    total:number;
    @Column()
    n_cantidad:number;
  
    @Column()
    id_saleproducto:number;

     @Column()
    id_producto:number;

     
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @ManyToOne(()=>Saleproducto,(saleproducto)=>saleproducto.id)
    @JoinColumn(  {name: 'id_saleproducto' })
    saleproducto: Saleproducto


     @ManyToOne(()=>ProductsMenbresia,(productos)=>productos.id_producto)
        @JoinColumn(  {name: 'id_producto' })
        productos: ProductsMenbresia
    


   


  
}
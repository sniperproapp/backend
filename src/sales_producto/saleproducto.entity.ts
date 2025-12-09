 
import { Saledetail } from "src/saledetail/saledetail.entity";
import { Saledetailproduc } from "src/salesdetalleproducto/saledetailproduc.entity";
import { User } from "src/users/user.entity";
 
import {    Column, Entity,   JoinColumn,   ManyToOne,   OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'Saleproducto'})
export class Saleproducto{

@PrimaryGeneratedColumn()
id: number

@Column()
method_payment:string;
 
@Column()
currency_total:string;

@Column()
currency_payment:string;

@Column()
total:number;
@Column()
price_dolar:number;

@Column()
n_transaccion:string;


@Column()
adress:string;

@Column()
telefono:string;


@Column()
status:string;

 @Column({default: 0})
  estadorecibido: number;

 
@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
created_at: Date;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
updated_at: Date;



 
@Column()
id_user:number;


 @ManyToOne(()=>User,(user)=>user.sales)
 @JoinColumn(  {name: 'id_user' }) 
 user: User

  @OneToMany(()=>Saledetailproduc,saledetailproduc=>saledetailproduc.saleproducto)
    saledetailsproduc: Saledetailproduc[]


}
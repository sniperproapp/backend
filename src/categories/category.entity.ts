import { Products } from "src/products/products.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'categories'})
export class Category{

@PrimaryGeneratedColumn()
id: number

@Column({unique:true})
name: string;

@Column()
description: string;

@Column()
image: string;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
created_at: Date;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
updated_at: Date;

@OneToMany(()=>Products,products=>products.id)
products: Products

}
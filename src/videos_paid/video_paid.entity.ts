import { hash } from "bcrypt";
import { ClaseCursos } from "src/clase/ClaseCursos.entity";
import { Cursos } from "src/cursos/Cursos.entity";
import { Products } from "src/products/products.entity";
import { Rol } from "src/roles/rol.entity";
import { User } from "src/users/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'videos_paid'})
export class Video_paid{
    @PrimaryGeneratedColumn()
    id: number;
      
   
    
    @Column()
    id_user:number;
    
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;
    
    @Column()
    id_clase:number;

  
    @ManyToOne(()=>ClaseCursos,(claseCursos)=>claseCursos.video_paid)
        @JoinColumn(  {name: 'id_clase' }) 
        claseCursos: ClaseCursos

    @ManyToOne(()=>User,(user)=>user.id)
        @JoinColumn(  {name: 'id_user' })
        user: User
    

}
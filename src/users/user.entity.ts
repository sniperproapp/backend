import { hash } from "bcrypt";
import { Products } from "src/products/products.entity";
import { Rol } from "src/roles/rol.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column({default:0})
    duplicatesesion: number;
   
    @Column({default:0})
    descargo: number;

    
    @Column({default:0})
    mensaje: number;

    @Column({default: 0})
    estado: number;


    @Column({unique:true})
    email: string;


    @Column({unique:true})
    phone: string;


    @Column()
    password: string;

    @Column({nullable:true})
    notification_token: string;

    @Column({nullable:true})
    imagen: string;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @JoinTable(
        {name:'user_has_roles',
        joinColumn:{
              name:'id_user'
            },
        inverseJoinColumn:{
            name:'id_rol'
        }
        }
    )
    @ManyToMany(()=>Rol,(rol)=>rol.users)
    roles: Rol[];

@BeforeInsert()
async hashPassword(){
    this.password=await hash(this.password,Number(process.env.HASH_SALT))
}
@OneToMany(()=>Products,products=>products.id)
products: Products


}
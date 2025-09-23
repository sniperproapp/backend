import { hash } from "bcrypt";
import { Cursos } from "src/cursos/Cursos.entity";
import { Products } from "src/products/products.entity";
import { Referral } from "src/referral/referral.entity";
import { Rol } from "src/roles/rol.entity";
import { Sale } from "src/sale/sale.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;
    @Column()
    wallet: string;

    @Column({default:0})
    duplicatesesion: number;
    @Column({default:0})
    duplicatesesionweb: number;
   
    @Column({default:0})
    descargo: number;

    
    @Column({default:0})
    mensaje: number;

    @Column({default: 0})
    estado: number;
    @Column({default: 0})
    estadoweb: number;


    @Column({unique:true})
    email: string;


    @Column({default: 0})
    phone: string;


    @Column()
    password: string;
    @Column()
    tokenpass: string;
    @Column({nullable:true})
    notification_token: string;

    @Column({nullable:true})
    imagen: string;
    
    @Column({nullable:true})
    imagenbio: string;


    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
     time_limit: Date;
     @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})  
     time_limit_web: Date;


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

    @OneToMany(()=>Products,products=>products.id)
    products: Products

    @OneToMany(()=>Sale,sale=>sale.user)
    sales: Sale[]
    
@BeforeInsert()
async hashPassword(){
    this.password=await hash(this.password,Number(process.env.HASH_SALT))
}
// @BeforeUpdate()
// async hashPasswordupdate(){
//     if(this.password!=''){
//     this.password=await hash(this.password,Number(process.env.HASH_SALT))}
// }
 

@Column({ nullable: true })
  referralCode: string;

  // Relación de muchos a uno: muchos usuarios pueden ser referidos por un solo usuario.
  @ManyToOne(() => User, user => user.referredUsers)
  @JoinColumn({ name: 'referrerId' }) // La columna que almacena el ID del referente
  referrer: User;

  @Column({ nullable: true })
  referrerId: number; // El ID del usuario que lo refirió

  // Relación de uno a muchos: un usuario puede referir a muchos otros.
  @OneToMany(() => User, user => user.referrer)
  referredUsers: User[];
  
  // Opcional: Relación con la tabla de recompensas
  @OneToMany(() => Referral, referral => referral.referrer)
  referrals: Referral[];

}
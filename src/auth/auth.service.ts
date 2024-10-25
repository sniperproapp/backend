import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterauthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';
import { MailsService } from 'src/mails/mails.service';
import  PUSH = require('../utils/firebase_message') ;
import { LoginidAuthDto } from './dto/loginid-auth.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import  storage = require( '../utils/cloud_storage');
 


@Injectable()
export class AuthService {
     
    constructor( @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Rol) private rolesRepository:Repository<Rol>
    , private jwtservice: JwtService,private mailservices: MailsService){

    }

    async register(user: RegisterauthDto)
    {
        const {email,phone} = user;
        const emailexist= await this.usersRepository.findOneBy({email:email})
        if(emailexist){
            //409
            throw new HttpException('el email ya existe',HttpStatus.FORBIDDEN);
        }

        // const phoneexist= await this.usersRepository.findOneBy({phone:phone})
        // if(phoneexist){
        //     //409
        //     throw new HttpException('el telefono ya existe',HttpStatus.CONFLICT);
        // }
        user.descargo=0;
        user.time_limit= new Date();
         
        const newUser=this.usersRepository.create(user);
        let rolesIds = [];
        if(user.rolesIds !== undefined && user.rolesIds!==null)
        {
            rolesIds=user.rolesIds;
        }else{
            rolesIds.push('CLIENT');
        }
         
        const roles =await this.rolesRepository.findBy({id: In(rolesIds)});
        newUser.roles= roles;
      
        const usersave= await this.usersRepository.save(newUser);
        const rolesstring =usersave.roles.map(rol=> rol.id)
        const payload={
            id:usersave.id,
            name:usersave.name,
            roles:rolesstring};
        const token = this.jwtservice.sign(payload);
        const data= {
         user:usersave,
         token:'Bearer ' + token
      }
     
      delete data.user.password;
      return data
      
    }




//register admin de metronic
    async register_admin(file: Express.Multer.File, user: RegisterauthDto)
    {

      
        const {email,phone} = user;
        const emailexist= await this.usersRepository.findOneBy({email:email})
        if(emailexist){
            //409
            throw new HttpException('el email ya existe',HttpStatus.FORBIDDEN);
        }

        // const phoneexist= await this.usersRepository.findOneBy({phone:phone})
        // if(phoneexist){
        //     //409
        //     throw new HttpException('el telefono ya existe',HttpStatus.CONFLICT);
        // }
        user.descargo=0;
        user.time_limit= new Date();
        const url =await storage(file,file.originalname);
       
        if(url ===undefined && url === null)
        {
          throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const newUser=this.usersRepository.create(user);
        let rolesIds = [];
        if(user.rol =='1' )
        {
            rolesIds.push('CLIENT');
            rolesIds.push('ADMIN');
        }else{
            rolesIds.push('CLIENT');
            rolesIds.push('PROF');
        }
         
        const roles =await this.rolesRepository.findBy({id: In(rolesIds)});
        newUser.roles= roles;
        newUser.imagen=url;
        const usersave= await this.usersRepository.save(newUser);
         
         
        
     
        delete usersave.password;
      return usersave
      
    }


     
    
    async recuperarpass(email: string)
    {
        this.mailservices.senUserConfirmation(email );


        return true
     }


     async updatepass(logindata: LoginAuthDto){
        const userfound= await this.usersRepository.findOneBy({email: logindata.email});

        if (!userfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
 
        userfound.password= await bcrypt.hash(logindata.password,10 );
       const isok= this.usersRepository.save(userfound);

       if(isok!=null) { return true }else{return true}

    }

    async login(logindata: LoginAuthDto)
    { 
         
        
        const {email,password}= logindata;
        const userFound= await this.usersRepository.findOne({
            where:{ email: email},
            relations:['roles']
            })

    
     
     if(!userFound)
      {
            throw new HttpException('EL EMAIL NO EXISTE',HttpStatus.NOT_FOUND);
       }



       if(userFound.estado==0)
       {
             throw new HttpException('Comuníquese con Administración para ser Activado',HttpStatus.FORBIDDEN);
        } 
   
        // if(userFound.duplicatesesion==1)
        // {
        //       throw new HttpException('Usuario tiene una sesion activa',HttpStatus.FORBIDDEN);
        //  } 
 
     
   const isPasswordValid = await compare(password,userFound.password)
   if(!isPasswordValid)
   {
    throw new HttpException('passwoed incorrecto',HttpStatus.FORBIDDEN);

       }
   

       if(userFound.notification_token!=logindata.token)
       {userFound.notification_token=logindata.token;}


   this.mailservices.welcome(email );

    const rolesIds = userFound.roles.map(rol=>rol.id) ;
    userFound.duplicatesesion=1;
    this.usersRepository.save(userFound);
   const payload={
    id:userFound.id
    ,name:userFound.name,
    roles: rolesIds
};
   const token = this.jwtservice.sign(payload);
   const data= {
    user:userFound,
    token:'Bearer ' + token
 }

 delete data.user.password;
   return data;
    }




     
    async login_admin(logindata: LoginAuthDto){ 
        
    const {email,password}= logindata;
    const userFound= await this.usersRepository.findOne({
        where:{ email: email},
        relations:['roles']
        })


 
 if(!userFound)
  {
        throw new HttpException('EL EMAIL NO EXISTE',HttpStatus.NOT_FOUND);
   }

   const rolesIdstest = userFound.roles.map(rol=>rol.id) ;
   
 
if(!rolesIdstest.find(x => x == 'ADMIN'))
    {
          throw new HttpException('Solo administrador pueden ingresar',HttpStatus.FORBIDDEN);
     }
   if(userFound.estado==0)
   {
         throw new HttpException('Comuníquese con Administración para ser Activado',HttpStatus.FORBIDDEN);
    } 

    // if(userFound.duplicatesesion==1)
    // {
    //       throw new HttpException('Usuario tiene una sesion activa',HttpStatus.FORBIDDEN);
    //  } 

 
const isPasswordValid = await compare(password,userFound.password)
if(!isPasswordValid)
{
throw new HttpException('passwoed incorrecto',HttpStatus.FORBIDDEN);

   }


   if(userFound.notification_token!=logindata.token)
   {userFound.notification_token=logindata.token;}


//this.mailservices.welcome(email );

const rolesIds = userFound.roles.map(rol=>rol.id) ;
userFound.duplicatesesion=1;
this.usersRepository.save(userFound);
const payload={
id:userFound.id
,name:userFound.name,
roles: rolesIds
};
const token = this.jwtservice.sign(payload);
const data= {
user:userFound,
token:'Bearer ' + token
}

delete data.user.password;
return data;
}

    async loginid(logindata: LoginidAuthDto)
    { 
         
        
        const {id}= logindata;
        const userFound= await this.usersRepository.findOne({
            where:{ id: id},
            relations:['roles']
            })

    
     
     if(!userFound)
      {
            throw new HttpException('EL EMAIL NO EXISTE',HttpStatus.NOT_FOUND);
       }

  

    const rolesIds = userFound.roles.map(rol=>rol.id) ;
    
    
   
   const token = logindata.token;

   const data= {
    user:userFound,
    token:  token}
   return data;
    }



    async logout(email: string)
    { 
         
        const userFound= await this.usersRepository.findOne({
            where:{ email: email},
            relations:['roles']
            })

     
     
     if(!userFound)
      {
            throw new HttpException('EL EMAIL NO EXISTE',HttpStatus.NOT_FOUND);
       }


 
        if(userFound.duplicatesesion==1)
        {
            userFound.duplicatesesion=0;
            this.usersRepository.save(userFound);
         } 
         
   return true;
    }

}

function dosDecimales(n) {
    let t=n.toString();
    let regex=/(\d*.\d{0,4})/;
    return t.match(regex)[0];
  }

 

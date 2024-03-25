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


@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Rol) private rolesRepository:Repository<Rol>
    , private jwtservice: JwtService,private mailservices: MailsService){

    }

    async register(user: RegisterauthDto)
    {
        const {email,phone} = user;
        const emailexist= await this.usersRepository.findOneBy({email:email})
        if(emailexist){
            //409
            throw new HttpException('el email ya existe',HttpStatus.CONFLICT);
        }

        const phoneexist= await this.usersRepository.findOneBy({phone:phone})
        if(phoneexist){
            //409
            throw new HttpException('el telefono ya existe',HttpStatus.CONFLICT);
        }
        user.descargo=0;
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

     this.mailservices.welcome(email );
     
     if(!userFound)
      {
            throw new HttpException('EL EMAIL NO EXISTE',HttpStatus.NOT_FOUND);
       }



       if(userFound.estado==0)
       {
             throw new HttpException('Usuario Desactivado',HttpStatus.FORBIDDEN);
        } 
   
        if(userFound.duplicatesesion==1)
        {
              throw new HttpException('Usuario tiene una sesion activa',HttpStatus.FORBIDDEN);
         } 
        
          
       
        
       
     
   const isPasswordValid = await compare(password,userFound.password)
   if(!isPasswordValid)
   {
    throw new HttpException('passwoed incorrecto',HttpStatus.FORBIDDEN);

       }

    const rolesIds = userFound.roles.map(rol=>rol.id) ;
   // userFound.duplicatesesion=1;
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

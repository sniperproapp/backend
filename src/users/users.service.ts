import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Rol } from '../roles/rol.entity';
import  storage = require( '../utils/cloud_storage');

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository:Repository<User>
        ,@InjectRepository(Rol) private RolesRepository:Repository<Rol>
    ){}
    create(user:CreateUserDto)
    {
const newUser=this.usersRepository.create(user);
return this.usersRepository.save(newUser)
    }

    findAll(){
        return this.usersRepository.find({relations:['roles']});
    }


    async update(id: number, user: UpdateUserDto){
        const userfound= await this.usersRepository.findOneBy({id: id});

        if (!userfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
        const updatedUser = Object.assign(userfound,user);
        return this.usersRepository.save(updatedUser);

    }
    async activate(id: number){
        const userfound= await this.usersRepository.findOneBy({id: id});

        if (!userfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
         userfound.estado=1;
         this.usersRepository.save(userfound);
        return true;

    }


    async descargo(id: number){
        const userfound= await this.usersRepository.findOneBy({id: id});

        if (!userfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
         userfound.descargo=1;
         this.usersRepository.save(userfound);
        return true;

    }
    async inactivate(id: number){
        const userfound= await this.usersRepository.findOneBy({id: id});

        if (!userfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
        userfound.estado=0;
        this.usersRepository.save(userfound);
        return true;

    }



    async updateWithImage(file: Express.Multer.File,id: number, user: UpdateUserDto){

       const url =await storage(file,file.originalname);
       
  if(url ===undefined && url === null)
  {
    throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
  }
  const userfound= await this.usersRepository.findOneBy({id: id});
       if (!userfound)
       {
        throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
       }
       user.imagen=url;
       const updatedUser = Object.assign(userfound,user);
       return this.usersRepository.save(updatedUser);
       
    }
}

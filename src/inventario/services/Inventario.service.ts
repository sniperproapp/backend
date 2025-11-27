import { Injectable, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateInventarioDto } from '../dto/createinventarioDto';
 
import { Inventario } from '../Inventario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
 
  
  
@Injectable()
export class InventarioService {
 
constructor(@InjectRepository(Inventario) private inventarioRepository: Repository<Inventario>,private readonly configService: ConfigService) {
    
   
 
  }
 
    
  
     
      



    async create(  inventario: CreateInventarioDto){
       let inventarionew = this.inventarioRepository.create( inventario);
       return this.inventarioRepository.save(inventarionew);
    }


 

 
}

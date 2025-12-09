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

     async update( id:number, stok: number){
      let inventario=await this.inventarioRepository.findOne({where:{id_inventario:id}})
        inventario.cantidad_stock=inventario.cantidad_stock-stok
       return this.inventarioRepository.save(inventario);
    }



    async delete (  id: number){
       
       return  this.inventarioRepository.delete(id);

 

 
}
}

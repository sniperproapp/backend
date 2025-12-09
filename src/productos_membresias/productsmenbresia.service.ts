import { HttpException, HttpStatus, Injectable, UploadedFile } from '@nestjs/common';
import { UpdateProductsDto } from './dto/update-Products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsMenbresia } from './ProductsMenbresia.entity';
import { Repository } from 'typeorm';
import {  CreateProductsMembresiaDto } from './dto/Create-Products.dto';
import async_foreach = require('../utils/async_foreach') ;
import  storage = require('../utils/cloud_storage') ;
import { User } from 'src/users/user.entity';
 
import { MembresiasService } from 'src/membresias/services/Membresias.service';
import { InventarioService } from 'src/inventario/services/Inventario.service';
import { CreateInventarioMembresiaDto } from './dto/inventario';
import { Inventario } from 'src/inventario/Inventario.entity';
 

function dosDecimales(n) {
    let t=n.toString();
    let regex=/(\d*.\d{0,4})/;
    return t.match(regex)[0];
  }

@Injectable()
export class ProductsMenbresiaService {

constructor (@InjectRepository(ProductsMenbresia) private producRepository: Repository<ProductsMenbresia>,
@InjectRepository(User) private usersRepository: Repository<User>,
 private readonly inventarioService: InventarioService,
private readonly membresiasService: MembresiasService){}


    async findAll( ){
         
      return this.producRepository.find({relations:['inventario'], order: {
        id_producto: "ASC" // "DESC"
    }})          
}


    async find( id_product:number){
          
      return this.producRepository.findOneBy( {
        id_producto: id_product // "DESC"
    })          
}



   


    async findAllproduct(id_product:number  ){
     
    
    return this.producRepository.findOne({relations:['inventario'],where: { 
        id_producto: id_product,
        
      }});
    
}




   


 

 




 
 


findid(id:number){ return this.producRepository.find({relations:['user'],where:{id_producto:id}}); }

 








async create(file: Express.Multer.File,product: CreateProductsMembresiaDto){   
    if (!file ){
        throw new HttpException("las imagene son obligatorias",HttpStatus.NOT_FOUND);
     
       }
     
       const newproduct = this.producRepository.create(product);
       
       const url =await storage(file,file.originalname);
       newproduct.image1=url;
       newproduct.tipo_articulo= "Fisico"
       newproduct.estad= 1



        const inventario = new Inventario();


        
       inventario.cantidad_stock=Number (product.stok)


       
       newproduct.inventario=inventario
      const saveProduct= await this.producRepository.save(newproduct);
 
        return  saveProduct;
   }





   async updateWithImage( file:  Express.Multer.File ,product: UpdateProductsDto){   
    
          
           const url =await storage(file,file.originalname);
           product.image1=url
           const updateproduct = await this.update( product);
           const valor = await this.producRepository.findOne({where:{id_producto:updateproduct.id_producto}})
    
    return valor;

   }


    async update(  product: UpdateProductsDto){
    

     const productsFound = await this.producRepository.findOneBy({id_producto:Number(product.id_producto)})
    
   if (!productsFound ){
    throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

   }
   const estadoproductanterior=productsFound.estad;
   delete product.id_producto;

   const updateproducts= Object.assign(productsFound, product);
      
   
     this.producRepository.save(updateproducts);
     const valor = await this.producRepository.findOne({where:{id_producto:updateproducts.id_producto}})
 
      return valor
    }





   

    async delete(id: number){
        const productsFound = await this.producRepository.findOne({where:{id_producto:id} ,relations: ['inventario' ],})
      if (!productsFound ){
       throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

 }
   console.log(productsFound)
      await this.inventarioService.delete(productsFound.inventario.id_inventario);
      return this.producRepository.delete(id);
   
       }



       

 

       

       
      
}

import { HttpException, HttpStatus, Injectable, UploadedFile } from '@nestjs/common';
import { UpdateProductsDto } from './dto/update-Products.dto copy';
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
        console.log('gercel')
      return this.producRepository.find({relations:['inventario'], order: {
        id_producto: "DESC" // "DESC"
    }})          
}


     


    async findAllproduct(id_product:number,idclient){
     
    const userfound= await this.usersRepository.findOneBy({id: idclient});
    
     if(userfound.estado==0)
     {
         
            throw new HttpException('usuario desactivado',HttpStatus.NOT_FOUND);
         
     }
    return this.producRepository.findOne({relations:['user'],where: { 
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





   async updateWithImage(id: number,files: Array<Express.Multer.File>,product: UpdateProductsDto){   
    
    if (files.length===0 ){
        throw new HttpException("las imagenes son obligatorias",HttpStatus.NOT_FOUND);
     
       }
       
       let counter =0;
       let imagentoupdatelist = JSON.parse(product.image_To_update);
       let uploadedFile=imagentoupdatelist[counter];
      
       const updateproduct = await this.update(id,product);
     
    
    const startforeach=async () => {
        await async_foreach(files,async(file:Express.Multer.File)=>{

            const url =await storage(file,file.originalname);

            if(url !==undefined && url!==null)
            {
                if(uploadedFile===0){
                    updateproduct.image1=url;
                }else  if(uploadedFile===1){
                    updateproduct.image1=url;
                }
    
            }
            await this.update(updateproduct.id_producto,updateproduct);
            counter++;
            uploadedFile=imagentoupdatelist[counter];
           

        })
       
        
    }
    await startforeach();
   
    const valor = await this.producRepository.findOne({relations:['user'],where:{id_producto:updateproduct.id_producto}})
    
    return valor;

   }


    async update(id: number,product: UpdateProductsDto){
    

     const productsFound = await this.producRepository.findOneBy({id_producto:id})
    
   if (!productsFound ){
    throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

   }
   const estadoproductanterior=productsFound.estad;


   const updateproducts= Object.assign(productsFound, product);
      
   
     this.producRepository.save(updateproducts);
     const valor = await this.producRepository.findOne({relations:['user'],where:{id_producto:updateproducts.id_producto}})
 
      return valor
    }





   

    async delete(id: number){
        const productsFound = await this.producRepository.findOneBy({id_producto:id})
      if (!productsFound ){
       throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

 }

     
      return this.producRepository.delete(id);
   
       }



       

 

       

       
      
}

import { HttpException, HttpStatus, Injectable, UploadedFile } from '@nestjs/common';
import { UpdateProductsDto } from './dto/update-Products.dto copy';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { Any, Repository } from 'typeorm';
import { CreateProductsDto } from './dto/Create-Products.dto';
import { dataidDto } from './dto/dataid.dto';
 
import async_foreach = require('../utils/async_foreach') ;
import  storage = require('../utils/cloud_storage') ;
import { activatetpDto } from './dto/activatetp.dto';
import { datalikeDto } from './dto/datalike.dto';
import { User } from 'src/users/user.entity';
import { stripVTControlCharacters } from 'util';
import { count } from 'console';
import  PUSH = require('../utils/firebase_message') ;
import { dataestadoDto } from './dto/dataestado.dto';

function dosDecimales(n) {
    let t=n.toString();
    let regex=/(\d*.\d{0,4})/;
    return t.match(regex)[0];
  }

@Injectable()
export class ProductsService {

constructor (@InjectRepository(Products) private producRepository: Repository<Products>,@InjectRepository(User) private usersRepository: Repository<User>){}


findAll(){
    return this.producRepository.find({relations:['user']})          
}


findAllCategory(id_category:number,estado:dataestadoDto){
     
    return this.producRepository.find({relations:['user'],where: { 
        id_category: id_category,
        estad: estado.estado
      }});
    
}

    async finAllcount (){

 
        let listarespuesta: Array< RespuestDto> =[]
       
        const data = await this.producRepository.find({
        relations:['user']});
        data.sort(function (a, b) {
            // A va primero que B
            if (a.user.id < b.user.id)
                return -1;
            // B va primero que A
            else if (a.user.id > b.user.id)
                return 1;
            // A y B son iguales
            else 
                return 0;
        });
        let coun=0;
        let  iduser;
        let  numeroaux=0;
        let  nombreaux='';

        data.forEach((element) => {
           
             if(coun==0)
             { 
                iduser=element.user.id;
                nombreaux=element.user.name
                numeroaux=1; 
             }else{
                        if(iduser==Number(element.user.id)){
                             numeroaux+=1; 
                        }else{
                            listarespuesta.push({x:nombreaux,y:numeroaux});
                            numeroaux=1; 
                            nombreaux=element.user.name
                            iduser=element.user.id;
                        }

             }

             iduser=element.user.id;
             coun=coun+1;
              
           
        }
        
        
        );
        listarespuesta.push({x:nombreaux,y:numeroaux});
  
         

return listarespuesta
}







async finAllranking (){

 
    let listarespuesta: Array< RespuesDtotaranking> =[]
     
    const data = await this.producRepository.find({
    relations:['user']});
    data.sort(function (a, b) {
        // A va primero que B
        if (a.user.id < b.user.id)
            return -1;
        // B va primero que A
        else if (a.user.id > b.user.id)
            return 1;
        // A y B son iguales
        else 
            return 0;
    });
    let coun=0;
    let  iduser;
    let  numeroaux=0;
    let  numerototalaux=0;
    let  nombreaux='';
    let  imagenaux='';

    data.forEach((element) => {
       
         if(coun==0)
         { 
            iduser=element.user.id;
            nombreaux=element.user.name
            imagenaux=element.user.imagen;
            numerototalaux=1;
            if(element.tpactivate1)
                        {
                            numeroaux=1;
                        }
            
         }else{
                    if(iduser==Number(element.user.id)){
                        numerototalaux+=1;
                        if(element.tpactivate1)
                        {
                            numeroaux+=1;
                        } 
                    }else{
                        

                        listarespuesta.push({nombre:nombreaux,ganadas:numeroaux,total:numerototalaux,imagen:imagenaux});
                        numerototalaux=1;
                        numeroaux=0;
                        if(element.tpactivate1)
                        {
                            numeroaux=1;
                        } 
                        nombreaux=element.user.name
                        imagenaux=element.user.imagen;

                        iduser=element.user.id;
                    }

         }

         iduser=element.user.id;
         coun=coun+1;
         
       
    }
    
    
    );
    listarespuesta.push({nombre:nombreaux,ganadas:numeroaux,total:numerototalaux,imagen:imagenaux});
     
     

return listarespuesta
}




findid(id:number){
    return this.producRepository.find({relations:['user'],where:{id:id}});
}


async create(files: Array<Express.Multer.File>,product: CreateProductsDto){   
    if (files.length===0 ){
        throw new HttpException("las imagene son obligatorias",HttpStatus.NOT_FOUND);
     
       }
     
       let uploadedFile=0;
       const newproduct = this.producRepository.create(product);
       const saveProduct= await this.producRepository.save(newproduct);

       if(saveProduct!=null )
       {
        let listastrintoken: Array<string> =[]   
         let listuser= await this.usersRepository.find({relations:['roles']});
          


         listuser.forEach((element) => {
        
            if(element.notification_token != null){
                listastrintoken.push(element.notification_token);
            }
       

         })

        const data1 ={
            tokens:listastrintoken,
            title:"NUEVA SEÑAL: "+newproduct.name+" CREADA",
            body:"PUNTO 1:"+dosDecimales(newproduct.price)   +"SL:"+dosDecimales(newproduct.sl)
         }
         await PUSH(data1);
       }
    
    const startforeach=async () => {
        await async_foreach(files,async(file:Express.Multer.File)=>{

            const url =await storage(file,file.originalname);

            if(url !==undefined && url!==null)
            {
                if(uploadedFile===0){
                    saveProduct.image2=url;
                }else  if(uploadedFile===1){
                    //saveProduct.image2=url;
                }
    
            }
            await this.update(saveProduct.id,saveProduct);
            uploadedFile=uploadedFile+1;
           

        })



         
       
        
    }
    await startforeach();

    const valor = await this.producRepository.findOne({relations:['user'],where:{id:saveProduct.id}})
    
    return  valor;

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
                    updateproduct.image2=url;
                }
    
            }
            await this.update(updateproduct.id,updateproduct);
            counter++;
            uploadedFile=imagentoupdatelist[counter];
           

        })
       
        
    }
    await startforeach();
   
    const valor = await this.producRepository.findOne({relations:['user'],where:{id:updateproduct.id}})
    
    return valor;

   }


    async update(id: number,product: UpdateProductsDto){
    

     const productsFound = await this.producRepository.findOneBy({id:id})
   if (!productsFound ){
    throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

   }

   const updateproducts= Object.assign(productsFound, product);
      
   const valor = await this.producRepository.findOne({relations:['user'],where:{id:updateproducts.id}})
     this.producRepository.save(updateproducts);
      return valor
    }

    async activatetp(data:activatetpDto){
         
    
         const productsFound = await this.producRepository.findOneBy({id:Number(data.id)})
       if (!productsFound ){
        throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);
    
       }
       if(Number(data.numero)==1){
        productsFound.tpactivate1=true;
       }
       if(Number(data.numero)==2){
        productsFound.tpactivate2=true;
       }
       if(Number(data.numero)==3){
        productsFound.tpactivate3=true;
       }
       if(Number(data.numero)==4){
        productsFound.tpactivate4=true;
       }
       if(Number(data.numero)==5){
        productsFound.tpactivate5=true;
       }
    
 
       const respu= this.producRepository.save(productsFound);
       if(respu){ return true;}else{return false}
    
        }

    async delete(id: number){
        const productsFound = await this.producRepository.findOneBy({id:id})
      if (!productsFound ){
       throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);
   
      }
   
    
      return this.producRepository.delete(id);
   
       }



       async like(id: number,datalike:datalikeDto){
        const productsFound = await this.producRepository.findOneBy({id:id})
      if (!productsFound ){
       throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);
   
      }


      if(datalike.numero==0){return productsFound.like;}
      productsFound.like=productsFound.like+1;
      const respu= this.producRepository.save(productsFound);


      if(respu){ return productsFound.like;}else{return 0;}
      
   
       }


       async getproductiduseridcategory(data: dataidDto){
        return await this.producRepository.find({relations:['user'],where:{id_category:Number(data.id_category),id_user:Number(data.id_user)}});
       }

       
      
}

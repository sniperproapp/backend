import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
import  storage = require( '../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import {   Like, Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { Vimeo } from '@vimeo/vimeo';
import getVideoDurationInSeconds from 'get-video-duration';
import { updateclaseCursosDto } from './dto/update-claseCursosDto';
import { CreateClaseCursosDto } from './dto/create-ClaseCursosDto';
import { ClaseCursos    } from './ClaseCursos.entity';
import { CreateclasevideoDto } from './dto/Create-Clase-video.dto';
import { ConfigService } from '@nestjs/config';
import { updateposclaseCursosDto } from './dto/updatepos-claseCursosDto';
import { filtroDto } from 'src/cursos/dto/filtro.dto';
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
 
const configService = new ConfigService();

const fs=require('fs')
let client = new Vimeo(configService.get('CLIENT_IDENTIFIER') , configService.get('CLIENT_SECRET'),configService.get('SECRE_KEY_VIMEO'));
 

@Injectable()
export class ClaseCursosService {
  AWS_S3_BUCKET = 'videosrespaldo';
  s3 = new AWS.S3({
    accessKeyId: configService.get('KEY_AWSS3'),
    secretAccessKey: configService.get('SECRE_KEY_AWSS3'),
  });


    constructor(
        @InjectRepository(ClaseCursos) private ClaseRepository: Repository<ClaseCursos>,@InjectRepository(User) private usersRepository: Repository<User>
    ){}

    async findAll(id:number){
      let listarespuesta: Array< any> =[]
      
     
      const data= await this.ClaseRepository.find({relations:['files'], where:{id_sectionCursos:id},   order: {
        posicion: "ASC"  } });
      data.forEach((element) => {
        let listatiempo: Array< any> =[]
        listatiempo.push(element.time)

        element.time= this.sumarTiempos(...listatiempo);
        listarespuesta.push(element)
    });
        return listarespuesta
    }
    



     async findAllsearch(search:filtroDto){
      console.log(search)
      let filters:any =  {
         title:Like(`%${search.search}%`),
         
           };

       let clases = await this.ClaseRepository.find({relations:['sectionCursos.cursos.user'],where:filters});
       console.log(clases)
        return clases
    }
       
       
     
       
    

   

    async create(  clase:CreateClaseCursosDto){

      const clasefound= await this.ClaseRepository.findOneBy({title:clase.title})
      // if(categorifound){
      //  throw new HttpException('la seccion ya se encuentra registrada ',HttpStatus.OK);

      // }
      const clasesfound= await this.ClaseRepository.find({where:{id_sectionCursos:clase.id_sectionCursos}})
         let i=0;
        for(let clase of clasesfound)
        {
          if(clase.posicion>i)
            { i=clase.posicion} 

        }
        clase.posicion=i+1;
        

       let newclase = this.ClaseRepository.create( clase);
 
     
      
       
      return this.ClaseRepository.save(newclase);
    }


     




     async update( id: number,section:updateclaseCursosDto){
        
      
     

        const categorifound= await this.ClaseRepository.findOneBy({id: id})
        if(!categorifound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.OK);
 
        }
         console.log(section);
         console.log(categorifound
          
         );

         categorifound.title=section.title;
         categorifound.estado=section.estado;
         categorifound.description=section.description;
        return this.ClaseRepository.save(categorifound);
      }




      async updatepos(  clases:updateposclaseCursosDto){
        
      
     

        const clase1found= await this.ClaseRepository.findOneBy({id: clases.id1})
        if(!clase1found){
         throw new HttpException('la clase no se encuentra ',HttpStatus.OK);
 
        }

        const clase2found= await this.ClaseRepository.findOneBy({id: clases.id2})
        if(!clase2found){
         throw new HttpException('la clase no se encuentra ',HttpStatus.OK);
 
        }
        const claselisfound= await this.ClaseRepository.find({where:{id_sectionCursos: clase1found.id_sectionCursos}})
        if(!clase1found){
         throw new HttpException('la clase no se encuentra ',HttpStatus.OK);
 
        }
         let id1=clase1found.posicion
         let id2=clase2found.posicion
         console.log(id1)
         console.log(id2)
       let i=0;
       if(id1<id2 ){
        for (let clase of claselisfound)
          {
           
           if(clase.posicion >= id1 && clase.posicion <= id2 ){
             claselisfound[i].posicion=claselisfound[i].posicion-1;
           }
           if(clase.id == clase1found.id ){
            claselisfound[i].posicion=id2;
          }
   
           i++;
           }

       }
       if(id1>id2 ){
        for (let clase of claselisfound)
          {
         
   
           if(clase.posicion <= id1 && clase.posicion >= id2 ){
             claselisfound[i].posicion=claselisfound[i].posicion+1;
           }
           if(clase.id == clase1found.id ){
            claselisfound[i].posicion=id2;
          }
           i++;
           }

       }
        

    
        
       
       this.ClaseRepository.save(claselisfound);
       
      
        

        
        return true;
      }

      async delete(id: number){

        const categorifound = await this.ClaseRepository.findOneBy({id: id})
        if(!categorifound){
            throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
    
           }
       
        return this.ClaseRepository.delete(id);

    }



    
async uploadvideovimeo(file: Express.Multer.File,curso: CreateclasevideoDto): Promise<any>
{
    return new Promise((resolve,reject)=>{

        client.upload(    
            file.path,
          {
            'name': curso.title,
            'description': curso.description
          },
              function (uri) {
            console.log('Your video URI is: ' + uri);
            fs.unlinkSync(file.path)//eliminar el video del servidor
            resolve( uri);
            
              
          },
          function (bytes_ed, bytes_total) {
            var percentage = (bytes_ed / bytes_total * 100).toFixed(2)
            console.log(bytes_ed, bytes_total, percentage + '%')
          },
          function (error) {
            reject('Failed because: ' + error)
          }
        )

    })
   
 
 

}

   

async uploadvideo(file: Express.Multer.File,curso: CreateclasevideoDto):Promise<any>
{
    let DURATION;
    const claseFound = await this.ClaseRepository.findOneBy({id:curso.id})
       
    

    
     getVideoDurationInSeconds(file.path).then((duration) => {
        console.log(this.formatarDuracion(duration))
       DURATION= this.formatarDuracion(duration)
        
     })
   
     const resul= await this.uploadFile(file,curso);
    
     //const tiempoTotal = this.sumarTiempos(...registros);
     
    // https://d3piexzjuky4o1.cloudfront.net/DIA+1+CLASE+2+SEMINARIO+PAINX+400.mp4
    claseFound.vimeo_id='https://d3piexzjuky4o1.cloudfront.net/'+ resul.Key;
    claseFound.time=DURATION;
    let savecurso= await this.ClaseRepository.save(claseFound); 
   // 
   return await savecurso;    

}


  formatarDuracion(durationInSeconds) {
     
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);
      const seconds = Math.floor(durationInSeconds % 60);
    
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
    
      return(  `${formattedHours}:${formattedMinutes}:${formattedSeconds}`);

 
 
}



  sumarTiempos(...tiempos) {
  // Convierte cada tiempo en formato "hh:mm:ss" a segundos y suma todos los segundos.
  const totalSegundos = tiempos.reduce((total, tiempo) => {
    const [horas, minutos, segundos] = tiempo.split(':').map(Number);
    return total + horas * 3600 + minutos * 60 + segundos;
  }, 0);

  // Convierte los segundos totales a formato "hh:mm:ss".
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  // Retorna el resultado formateado.
  return `${horas} horas ${minutos} minutos ${segundos} segundos`;
}


async uploadFile(file,curso) {
  const { filename } = file;
  const stream = fs.createReadStream(file.path)
   
  return await this.s3_upload(
    stream,
    this.AWS_S3_BUCKET,
    filename,
    file.mimetype,
  );
}

async s3_upload(file, bucket, name, mimetype) {
  const params = {
    Bucket: bucket,
    Key: String(name),
    Body: file,
    ACL: 'public-read',
    ContentType: mimetype,
    ContentDisposition: 'inline',
    CreateBucketConfiguration: {
      LocationConstraint: 'us-west-2',
    },
  };

  try {  
    let s3Response = await this.s3.upload(params).promise();
  console.log(s3Response);
  fs.unlinkSync(file.path)//eliminar el video del servidor
    return s3Response;
  } catch (e) {
    console.log(e);
  }
}
   



}

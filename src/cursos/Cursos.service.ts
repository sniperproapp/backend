import { HttpException, HttpStatus, Injectable   } from '@nestjs/common';
 
import { InjectRepository } from '@nestjs/typeorm';
 
 
import { CreatecursoDto } from './dto/Create-Curso.dto';
 
import  storage = require('../utils/cloud_storage') ;
 
import { User } from 'src/users/user.entity';
 
import  PUSH = require('../utils/firebase_message') ;
import { dataestadoDto } from './dto/dataestado.dto';
 
import { Cursos } from './Cursos.entity';
import { Repository } from 'typeorm';
 
import { CategoryCursos } from 'src/categoriesCursos/categoryCursos.entity';
import { UpdateCursoDto } from './dto/update-Curso.dto';
import { Vimeo } from '@vimeo/vimeo';
import { CreatecursovideoDto } from './dto/Create-Curso-video.dto';
import { SectionCursos } from 'src/section/SectionCursos.entity';
import { Cursoresouce } from './dto/Cursoresouce.dto';
import { ConfigService } from '@nestjs/config';
import { DescuentoCursos } from 'src/descuento/descuentoCursos.entity';
 const fs=require('fs')
 const configService = new ConfigService();
 let client = new Vimeo(configService.get('CLIENT_IDENTIFIER') , configService.get('CLIENT_SECRET'),configService.get('SECRE_KEY_VIMEO'));

@Injectable()
export class CursosService {



constructor (@InjectRepository(Cursos) private cursoRepository: Repository<Cursos>,@InjectRepository(User) private usersRepository: Repository<User>,
 @InjectRepository(CategoryCursos) private categorycursoRepository: Repository<CategoryCursos>,
 @InjectRepository(SectionCursos) private seccioncursoRepository: Repository<SectionCursos>,
 @InjectRepository(DescuentoCursos) private descuentocursoRepository: Repository<DescuentoCursos>){}







 
  
 

    async findAll( ){
    
    return this.cursoRepository.find({relations:['user','categorycurso'],order: {
        id: "DESC" // "DESC"
    }})          
}


async findAlltienda( ){
    
    let cursosresp:Cursoresouce
    let cursosrespretu:any[]=[]
    let descuento_g:any
    let descuetos= await this.descuentocursoRepository.find({ });
   let cursos= await this.cursoRepository.find({relations:['user','categorycurso'],take: 3}) 
  console.log(cursos)
   cursos.forEach((curso) => {
     descuetos.forEach((descuento) => {
        if(descuento.type_segment==1){
            descuento.courses.forEach((id) => {
                  if(id==curso.id)
                  {
                    descuento_g=descuento;
                  }
            })
        }else {
            descuento.categories.forEach((id) => {
                if(id==curso.id)
                    { descuento_g=descuento;}
            })
        }
     })
      
     const updatecurso= Object.assign(curso, cursosresp);
     if(descuento_g.id>0){
        updatecurso.discount_g=descuento_g
    }

    
    cursosrespretu.push(updatecurso)

   })
    
    return cursosrespretu        



            
}



async findAlltiendabaner( ){
    
    return this.cursoRepository.find({relations:['user','categorycurso'],take: 3,where:{}})          
}


async findAlltiendacategory(id_category:number ){
    let cursosresp:Cursoresouce
    let cursosrespretu:any[]=[]
    let descuento_g:any
    let descuetos= await this.descuentocursoRepository.find({ });
   let cursos= await this.cursoRepository.find({relations:['user','categorycurso'],take: 3,where:{id_category_curso:id_category}}) 
  console.log(cursos)
   cursos.forEach((curso) => {
     descuetos.forEach((descuento) => {
        if(descuento.type_segment==1){
            descuento.courses.forEach((id) => {
                  if(id==curso.id)
                  {
                    descuento_g=descuento;
                  }
            })
        }else {
            descuento.categories.forEach((id) => {
                if(id==curso.id)
                    { descuento_g=descuento;}
            })
        }
     })
      
     const updatecurso= Object.assign(curso, cursosresp);
     if(descuento_g.id>0){
        updatecurso.discount_g=descuento_g
    }

    
    cursosrespretu.push(updatecurso)

   })
    
    return cursosrespretu         
}


async findAlltiendauser(id_user:number ){
    let cursosresp:Cursoresouce
    let cursosrespretu:any[]=[]
    let descuento_g:any
    let descuetos= await this.descuentocursoRepository.find({ });
     let cursos = await this.cursoRepository.find({relations:['user','categorycurso'],take: 3,where:{id_user:id_user}})        
  console.log(cursos)
   cursos.forEach((curso) => {
     descuetos.forEach((descuento) => {
        if(descuento.type_segment==1){
            descuento.courses.forEach((id) => {
                  if(id==curso.id)
                  {
                    descuento_g=descuento;
                  }
            })
        }else {
            descuento.categories.forEach((id) => {
                if(id==curso.id)
                    { descuento_g=descuento;}
            })
        }
     })
      
     const updatecurso= Object.assign(curso, cursosresp);
     if(descuento_g.id>0){
        updatecurso.discount_g=descuento_g
    }

    
    cursosrespretu.push(updatecurso)

   })
    
    return cursosrespretu    
    
      
}

 



async uploadvideo(file: Express.Multer.File,curso: CreatecursovideoDto):Promise<any>
{
    const cursoFound = await this.cursoRepository.findOneBy({id:curso.id})
       
     const resul= await this.uploadvideovimeo(file,curso);

        
    cursoFound.vimeo_id="https://player.vimeo.com/video/"+resul.split('/')[2];
    let savecurso= this.cursoRepository.save(cursoFound); 
   return await savecurso;    

}





async uploadvideovimeo(file: Express.Multer.File,curso: CreatecursovideoDto): Promise<any>
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
            fs.unlinkSync(file.path)
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


    async findAllcurso(id_curso:number ){
     
        let descuento_g:any=''
        let descuetos= await this.descuentocursoRepository.find({ });
         descuetos.forEach((descuento) => {
            if(descuento.type_segment==1){
                descuento.courses.forEach((id) => {
                      if(id==id_curso)
                      {
                        descuento_g=descuento;
                      }
                })
            }else {
                descuento.categories.forEach((id) => {
                    if(id==id_curso)
                        { descuento_g=descuento;}
                })
            }
    
         
        })
    
    let cursosresp: Cursoresouce;
    
   let cursos= await this.cursoRepository.findOne({relations:['user','categorycurso','seciones.clases.files'],where: { 
        id: id_curso,
        
      }});
      const updatecurso= Object.assign(cursos, cursosresp);
     
      let i=0;
      let numeroclase=0;
      let timecurso:any[]=[]
      updatecurso.seciones.forEach((secione) => {
        let timeseccion:any[]=[]
        numeroclase+= secione.clases.length
        secione.clases.forEach((clase) => {
            timeseccion.push(clase.time)
            timecurso.push(clase.time)
        })
      
        updatecurso.seciones[i].time_parse= this.sumarTiempos(...timeseccion)
        
        i++
      })
      if(descuento_g.id>0){
        updatecurso.discount_g=descuento_g
    }
      updatecurso.time_parse= this.sumarTiempos(...timecurso)
      updatecurso.num_clases=numeroclase;
    return updatecurso



       
    
}

async findAllcursolanding(id_curso:number ){
     
   
    let descuento_g:any=''
    let descuetos= await this.descuentocursoRepository.find({ });
     descuetos.forEach((descuento) => {
        if(descuento.type_segment==1){
            descuento.courses.forEach((id) => {
                  if(id==id_curso)
                  {
                    descuento_g=descuento;
                  }
            })
        }else {
            descuento.categories.forEach((id) => {
                if(id==id_curso)
                    { descuento_g=descuento;}
            })
        }

     
    })
     
    let cursosresp: Cursoresouce;
 
   
   let cursos= await this.cursoRepository.findOne({relations:['user','categorycurso','seciones.clases.files'],where: { 
        id: id_curso,
        
      }});

      const updatecurso= Object.assign(cursos, cursosresp);
     
      let i=0;
      let numeroclase=0;
      let timecurso:any[]=[]
      updatecurso.seciones.forEach((secione) => {
        let timeseccion:any[]=[]
        numeroclase+= secione.clases.length
        secione.clases.forEach((clase) => {
            timeseccion.push(clase.time)
            timecurso.push(clase.time)
        })
      
        updatecurso.seciones[i].time_parse= this.sumarTiempos(...timeseccion)
        
        i++
      })
      if(descuento_g.id>0){
        updatecurso.discount_g=descuento_g
    }
      updatecurso.time_parse= this.sumarTiempos(...timecurso)
      updatecurso.num_clases=numeroclase;
    return updatecurso



       
    
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
 
     



 







 

 




async create(file: Express.Multer.File,curso: CreatecursoDto){   
    
   
      
      
       

      
       const newcurso = this.cursoRepository.create(curso);
        console.log(curso)
       const url =await storage(file,file.originalname);
       console.log(url)
       if(url ===undefined && url === null)
       {
         throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
       }
    
        newcurso.imagen=url
        newcurso.slug=newcurso.title
        newcurso.estado=1
         
        console.log(newcurso)
      
       const savecurso= await this.cursoRepository.save(newcurso);
   
          return  savecurso;
   }





   async updateWithImage( file: Express.Multer.File,curso: UpdateCursoDto){   
 
    const url =await storage(file,file.originalname);
    console.log(url)
    if(url ===undefined && url === null)
    {
      throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
    }
       
        
       curso.imagen=url;
       
       const updateproduct = await this.update( curso);
      
    
    return updateproduct;

   }


    async update( curso: UpdateCursoDto){
    
        
     const cursoFound = await this.cursoRepository.findOneBy({id:curso.id})
    
   if (!cursoFound ){
    throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

   }
    

   delete curso.id;
   const updatecurso= Object.assign(cursoFound, curso);
      
   
     this.cursoRepository.save(updatecurso);
   
      return new HttpException("curso editado correctamente",HttpStatus.OK);
    }




 

    async delete(id: number){
        const productsFound = await this.cursoRepository.findOneBy({id:id})
      if (!productsFound ){
       throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

 } 
      return this.cursoRepository.delete(id);
   
       }


 


        

       
      
}

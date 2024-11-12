import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
import  storage = require( '../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { CategoryCursos } from './categoryCursos.entity';
 
import { updatecategoryCursosDto } from './dto/update-categoryCursosDto';
import { Cursos } from 'src/cursos/Cursos.entity';
import { CreateCategoryCursosDto } from './dto/create-categoryCursosDto copy';
import { CategoryCursosDto } from './dto/categoryCursosDto';
import { CategoryCursosResouceDto } from './dto/categoryCursosresouceDto';



@Injectable()
export class CategoriesCursosService {
    constructor(
      @InjectRepository(CategoryCursos) private categoriesRepository: Repository<CategoryCursos>,
       @InjectRepository(Cursos) private cursosRepository: Repository<Cursos>
       ,@InjectRepository(User) private usersRepository: Repository<User>
    ){}

    async findall(busqueda:string){
      if(busqueda=='allcategorie'){
        return this.categoriesRepository.find();
    }
    else{
        return this.categoriesRepository.find({where:{titulo:Like('%'+busqueda+'%')}});
    }  
       
    }

   
    async findalltienda(busqueda:string){
      if(busqueda=='allcategorie'){
         let categoriasresul:CategoryCursosDto[]=[];
         let categories=await this.categoriesRepository.find({where:{estado:1}});
         
          for(let categoria of  categories ){
            let numerocursos=await this.cursosRepository.count({where:{id_category_curso:categoria.id}});

            categoriasresul.push({ id: categoria.id,titulo: categoria.titulo,estado: categoria.estado
              ,count_curso:numerocursos ,image:categoria.image,
              created_at: categoria.created_at,updated_at: categoria.updated_at })
          }

        return categoriasresul;
    }
    else{
        return this.categoriesRepository.find({where:{titulo:Like('%'+busqueda+'%')}});
    }
  }



     
  async findalltiendacategoriacursos(){
     
       let categoriasresul:CategoryCursosResouceDto[]=[];
       let categories=await this.categoriesRepository.find({relations:['cursos'],where:{estado:1}});
       
          for(let categoria of  categories ){
             

            categoriasresul.push({ id: categoria.id,titulo: categoria.titulo,estado: categoria.estado
              ,count_curso:categoria.cursos.length ,image:categoria.image,
              created_at: categoria.created_at,updated_at: categoria.updated_at,cursos:categoria.cursos,titulosinespacio:categoria.titulo.replace(/\s+/g,"") })
          }

      return categoriasresul;
  
  
      
  
}






    async create(file: Express.Multer.File,category:CreateCategoryCursosDto){

      const categorifound= await this.categoriesRepository.findOneBy({titulo:category.titulo})
      if(categorifound){
       throw new HttpException('1',HttpStatus.OK);

      }
       let newcategory = this.categoriesRepository.create(category);
 
     
      const url = await  storage(file,file.originalname);
      if(url ===undefined && url === null)
      {
        throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
      }
      newcategory.image=url;
      return this.categoriesRepository.save(newcategory);
    }


    async updateWithImage(file: Express.Multer.File,id: number,category:updatecategoryCursosDto){
       
       const url = await  storage(file,file.originalname);
       if(url ===undefined && url === null)
       {
         throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
       }
       const categorifound= await this.categoriesRepository.findOneBy({id: id})
       if(!categorifound){
        throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);

       }
       delete category.id;
      
      category.image=url;
      const updatecategory = Object.assign(categorifound,category);
       return this.categoriesRepository.save(updatecategory);
     }




     async update( id: number,category:updatecategoryCursosDto){
        
       
        const categorifound= await this.categoriesRepository.findOneBy({id: id})
        if(!categorifound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
 
        }
        
        delete categorifound.id;
        
         
        const updatecategory = Object.assign(categorifound,category);
       
         
         
        return this.categoriesRepository.save(updatecategory);
      }

      async delete(id: number){

        const categorifound = await this.categoriesRepository.findOneBy({id: id})
        if(!categorifound){
            throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
    
           }
       
        return this.categoriesRepository.delete(id);

    }


    

}

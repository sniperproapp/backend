import { Body,   Controller, Delete,  FileTypeValidator,  Get,    MaxFileSizeValidator,    Param,    ParseFilePipe,    ParseIntPipe, Post,   UploadedFile,   UseGuards, UseInterceptors  } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
 
 
import { updateclaseCursosDto } from './dto/update-claseCursosDto';
 
import { CreateClaseCursosDto    } from './dto/create-ClaseCursosDto';
import { ClaseCursosService } from './Clase_cursos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreatecursovideoDto } from 'src/cursos/dto/Create-Curso-video.dto';
import { renameimage } from 'src/cursos/helpers/imagen.helpers';
import { updateposclaseCursosDto } from './dto/updatepos-claseCursosDto';

@Controller('course_clase')
export class ClaseCursosController {

    constructor(private claseServices: ClaseCursosService ){

    }

    @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Get(':id')
    findall(@Param('id') id: number){
      return this.claseServices.findAll(id);
    }
    

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post() 
createWithImage(   
 @Body()  clase :CreateClaseCursosDto) {
 
   return this.claseServices.create( clase);
}


  

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update')
update( 
@Body() clase:updateclaseCursosDto){

return this.claseServices.update(clase.id,clase);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('updatepos')
updatepos( 
@Body() clase:updateposclaseCursosDto){

return this.claseServices.updatepos(clase);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete('remove/:id')
delete(@Param('id',ParseIntPipe) id:number){

return this.claseServices.delete(id);
}




@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('upload_vimeo')
@UseInterceptors(FileInterceptor('file',{
  storage:diskStorage({
    destination:'./upload',
    filename:renameimage
  })
}))
upload(@UploadedFile( 
  new ParseFilePipe({
    validators: [
     //new FileTypeValidator({ fileType: '.(mpg|wmv|mp4)' }),
      new MaxFileSizeValidator({ maxSize: 1024*1024*1000 }),
      
    ],
  }),
) file: Express.Multer.File,
 @Body() curso:CreatecursovideoDto)  {
  console.log(file)
 
  return this.claseServices.uploadvideo(file,curso);
}
}

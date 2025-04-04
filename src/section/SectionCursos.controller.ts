import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
import { JwtService } from '@nestjs/jwt';
 
import {  updatesectionCursosDto } from './dto/update-sectionCursosDto';
import { SectionCursosService } from './section_cursos.service';
import { CreateSectionCursosDto } from './dto/create-sectionCursosDto';

@Controller('course_section')
export class SectionCursosController {

    constructor(private SectionServices: SectionCursosService,private jwtservice: JwtService){

    }

    @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Get(':id')
    findall(@Param('id') id: number){
      return this.SectionServices.findAll(id);
    }
    

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post() 
createWithImage(   
 @Body()  section :CreateSectionCursosDto) {
 
   return this.SectionServices.create( section);
}


  

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update')
update( 
@Body() section:updatesectionCursosDto){

return this.SectionServices.update(section.id,section);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete('remove/:id')
delete(@Param('id',ParseIntPipe) id:number){

return this.SectionServices.delete(id);
}
}

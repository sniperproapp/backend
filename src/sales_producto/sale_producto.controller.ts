import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
import { JwtService } from '@nestjs/jwt';
 
import {  updatesectionCursosDto } from './dto/update-sectionCursosDto';
import { CreateSaleDto } from './dto/create-saleDto';
import { saleproductoService    } from './saleproducto.service';
import { CreateinscrilDto } from './dto/Createinscri.dto';

@Controller('sale_producto')
export class saleproductoController {

    constructor(private saleproductoServices: saleproductoService,private jwtservice: JwtService){

    }

    @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Get(':id')
    findall(@Param('id') id: number,){
      
      return this.saleproductoServices.findAll(id);
    }
    

 
 
@Post() 
create(   
  @Headers() headers, 
 @Body( )  sale :CreateSaleDto) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  sale.id_user=idclient.id
   return this.saleproductoServices.create( sale);
}



 
@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('inscribir/:id')
 inscribir( @Headers() headers,@Param('id',ParseIntPipe) id:number , 
 @Body()  iduse :CreateinscrilDto) {
  
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
 
  return this.saleproductoServices.inscribir(id,idclient.id );
}


  

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update')
update( 
@Body() section:updatesectionCursosDto){

return this.saleproductoServices.update(section.id,section);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete('remove/:id')
delete(@Param('id',ParseIntPipe) id:number){

return this.saleproductoServices.delete(id);
}
}

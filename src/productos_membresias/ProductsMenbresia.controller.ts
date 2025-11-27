import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsMenbresiaService   } from './productsmenbresia.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
import { UpdateProductsDto } from './dto/update-Products.dto copy';
  
import { JwtService } from '@nestjs/jwt';
import { CreateProductsMembresiaDto } from './dto/Create-Products.dto';
@Controller('products_menbresia')
export class ProductsMenbresiaController {

constructor(private producservices: ProductsMenbresiaService,private jwtservice: JwtService){}


 
 
@Get()
finAll( ) {
  
  
  return this.producservices.findAll( );
}



 

@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get(':id_product')
finAllproduct(@Param('id_product',ParseIntPipe) id_product:number,@Headers() headers ) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.producservices.findAllproduct(id_product ,idclient['id']);
}


 


 


@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get('id/:id')
findid(@Param('id',ParseIntPipe) id :number,) {
 
  return this.producservices.findid(id );
}
 
 

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post()
@UseInterceptors(FileInterceptor('file'))
create(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*30 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
    ],
  }),
) file: Express.Multer.File,
 @Body() product:CreateProductsMembresiaDto) {
 
  return this.producservices.create(file,product);
}

 
@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put('upload/:id')
@UseInterceptors(FilesInterceptor('files[]',2))
Updatewithimage(@UploadedFiles( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) files: Array<Express.Multer.File>,
@Param('id',ParseIntPipe) id:number,
 @Body() product:UpdateProductsDto) {
 
  return this.producservices.updateWithImage(id,files,product);
}



@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put(':id')
 
Update ( 
@Param('id',ParseIntPipe) id:number,
 @Body() product:UpdateProductsDto) {
 
  return this.producservices.update(id,  product);
}



@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete(':id')
 
delete ( 
@Param('id',ParseIntPipe) id:number)
  {
 
  return this.producservices.delete(id);
}

 
}

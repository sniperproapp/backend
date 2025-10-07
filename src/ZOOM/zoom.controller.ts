import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';

 
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
import { ZoomService } from './zoom.service';
import { updateZoomDto } from './dto/update-ZoomDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsGateway } from 'src/comunication/events.gateway';
import { LeyendaDto } from './dto/leyenda.dto';

@Controller('zoom')
export class ZoomController {
constructor(private  zoomservices:ZoomService,private readonly eventsGateway: EventsGateway){}
 
@HasRoles(JwtRole.CLIENT,JwtRole.ADMIN,JwtRole.PROF
  )
  @UseGuards(JwtAuthGuard ,JwtRolesGuard)
  @Get()
  findall(){
     return this.zoomservices.findAll();
 
  }


  @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put(':id')
update(@Param('id',ParseIntPipe) id:number,
@Body() zoom:updateZoomDto){

return this.zoomservices.update(id,zoom);
}



@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put('upload/:id')
@UseInterceptors(FileInterceptor('file'))
updateWithImage(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) file: Express.Multer.File,
@Param('id',ParseIntPipe) id:number,
 @Body() zoom:updateZoomDto) {
 
  return this.zoomservices.updateWithImage(file,id,zoom);
}
 
 @Post('mostrar-leyenda')
  mostrarLeyenda(@Body() leyendaDto: LeyendaDto) {
    // 1. Recibimos la petición HTTP desde el panel de admin.
    // 2. Llamamos al método público de nuestro Gateway.
    this.eventsGateway.broadcastNuevaLeyenda("Operativa en Vivo");
    
    // 3. El Gateway se encarga de emitir el evento a todos los clientes.
    return { success: true, message: 'Leyenda enviada a todos los usuarios.' };
  }

  
}

 
 
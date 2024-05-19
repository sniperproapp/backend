import { Body, Controller, Get,   UseGuards } from '@nestjs/common';
 
 
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
import { ZoomService } from './zoom.service';
import { updateZoomDto } from './dto/update-ZoomDto';

@Controller('zoom')
export class ZoomController {
constructor(private  zoomservices:ZoomService){}
 
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

return this.zoomServices.update(id,zoom);
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
 
  return this.zoomServices.updateWithImage(file,id,zoom);
}
 

}
 
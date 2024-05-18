import { Body, Controller, Get,   UseGuards } from '@nestjs/common';
 
 
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
import { ZoomService } from './zoom.service';

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
 

}
 
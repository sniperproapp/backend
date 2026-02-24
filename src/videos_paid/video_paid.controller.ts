import { Body, Controller, Get,   UseGuards } from '@nestjs/common';
 
 
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { Video_paidService    } from './video_paid.service';

@Controller('video_paid')
export class Video_paidController {
constructor(private  video_paidservices:Video_paidService){}
 
@HasRoles(JwtRole.CLIENT,JwtRole.ADMIN,JwtRole.PROF
  )
  @UseGuards(JwtAuthGuard ,JwtRolesGuard)
  @Get()
  findall(){
     return this.video_paidservices.findAll();
 
  }
 

}
 
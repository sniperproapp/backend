import { Body, Controller, Get,   Param,   UseGuards } from '@nestjs/common';
 
 
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { Video_paidService    } from './video_paid.service';

@Controller('video_paid')
export class Video_paidController {
constructor(private  video_paidservices:Video_paidService){}
 




 
  @Get(':id')
  findall(@Param('id') id:number){
    console.log(id)
     return this.video_paidservices.findAll(id);
 
  }
 

}
 
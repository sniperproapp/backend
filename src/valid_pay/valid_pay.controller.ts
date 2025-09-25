import { Body,   Controller, Delete,  FileTypeValidator,  Get,    MaxFileSizeValidator,    Param,    ParseFilePipe,    ParseIntPipe, Post,   UploadedFile,   UseGuards, UseInterceptors  } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
 
 
 
import { FileInterceptor } from '@nestjs/platform-express';
 
 
import { valid_payService } from './valid_pay.service';
 

@Controller('valid_pay')
export class valid_payController {

    constructor(private valid_payServices: valid_payService ){

    }

   

 

  

 
@Post('valid')
update( 
@Body() data:any){

return this.valid_payServices.update(data);
}



@Post('create/:id')
createpay(@Param('id') id:number){

return this.valid_payServices.Create(id);
}







}

import { Body,   Controller, Delete,  FileTypeValidator,  Get,    MaxFileSizeValidator,    Param,    ParseFilePipe,    ParseIntPipe, Post,   UploadedFile,   UseGuards, UseInterceptors  } from '@nestjs/common';
 
 
 
import { referralService } from './referral.service';
 

@Controller('referral')
export class referralController {

    constructor(private referralServices: referralService ){

    }

   

 
 @Get('nivel1/:id')
    getlistn1( @Param('id') id: number): any {
       
      return this.referralServices.getlistn1(id);
    }

     @Get('comisiones/:id')
    getlist( @Param('id') id: number): any {
       
      return this.referralServices.getlist(id);
    }



      
 





}

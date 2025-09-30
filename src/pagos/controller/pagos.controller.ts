import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PagosService } from '../services/pagos.service';
import { CreatepagosDto } from '../dto/createpagosDto';

@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosservices: PagosService) {}

     @Get('2af')
     getHello(): any {
       return this.pagosservices.get2af();
     }

 
@Post('pagomensual') 
createWithImage(   
 @Body()  pago :CreatepagosDto) {
 
   return this.pagosservices.create( pago);
}




}

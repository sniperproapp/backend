import { Controller, Get } from '@nestjs/common';
import { PagosService } from '../services/pagos.service';

@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosservices: PagosService) {}

    @Get('orden')
    getHello(): any {
      return this.pagosservices.getHello();
    }
}

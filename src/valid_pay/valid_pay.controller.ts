import { Body,   Controller, Delete,  FileTypeValidator,  Get,    MaxFileSizeValidator,    Param,    ParseFilePipe,    ParseIntPipe, Post,   Query,   UploadedFile,   UseGuards, UseInterceptors  } from '@nestjs/common';
 
 import * as crypto from 'crypto';
 
 
import { valid_payService } from './valid_pay.service';
import { CreatesignatureDto } from './dto/signature.dto';
 

@Controller('valid_pay')
export class valid_payController {

    constructor(private valid_payServices: valid_payService ){

    }

   

 

  

 
@Post('valid')
update( 
@Body() data:any){

return this.valid_payServices.update(data);
}


@Post('validwompi')
updatewompi( 
@Body() data:any){

return this.valid_payServices.updatewompi(data);
}



@Post('create/:id')
createpay(@Param('id') id:number){

return this.valid_payServices.Create(id);
}



@Post('integrity-signature')

getSignature( @Body() data:CreatesignatureDto) {
  const amountInCents = data.amount * 100;

  const currency = 'COP';
  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<secret")
  console.log(secret)
  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<secret")

  console.log(data.reference)
  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<secret")

  console.log(data.amount)
  const hash = crypto
    .createHash('sha256')
    .update(`${data.reference}${data.amount}${currency}${secret}`)
    .digest('hex');

  return { signature: hash };
}



}

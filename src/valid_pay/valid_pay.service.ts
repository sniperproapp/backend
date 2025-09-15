import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
 
import { InjectRepository } from '@nestjs/typeorm';
import {   Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { Sale } from 'src/sale/sale.entity';
 
 
 
 


 
@Injectable()
export class valid_payService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Sale) private saleRepository: Repository<Sale>
    ){}

     


     async update( data: any  ){
        const fecha = new Date();
        const mesActual = fecha.getMonth();
        fecha.setMonth(mesActual + 1);
        const anio = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque es base 0, y padStart para 2 dígitos
        const dia = fecha.getDate().toString().padStart(2, '0');

        const fechaFormateada = `${anio}-${mes}-10`;

     const saleinfo= await  this.saleRepository.findOne({where:{n_transaccion:data.order_id}})
     saleinfo.status=data.payment_status
     
     if(data.payment_status=="finished")
     {
       
       
       const userinfo= await  this.usersRepository.findOne({where:{id:saleinfo.id_user }})
       userinfo.estado=1
       userinfo.estadoweb=1
       userinfo.time_limit=new Date(fechaFormateada)
       userinfo.time_limit_web=new Date(fechaFormateada)
       this.usersRepository.save(userinfo)

     }
     this.saleRepository.save(saleinfo)
      
        console.log(fechaFormateada)
     console.log("payment_id")    
     console.log(data.payment_id)  
     console.log("paymentstatus")  
     console.log(data.payment_status)  
         console.log("order_id")  
     console.log(data.order_id)  
     
   
     
 
        return   console.log(data);
      }

     
     
      



 

  
 


 
}

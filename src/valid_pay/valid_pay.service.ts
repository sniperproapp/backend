import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 import { ConfigService } from '@nestjs/config';
 
 
import { InjectRepository } from '@nestjs/typeorm';
import {   Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { Sale } from 'src/sale/sale.entity';
import { Referral } from 'src/referral/referral.entity';
import { CreateReferralDto } from './dto/create-referral.dto';
import { referralService } from 'src/referral/referral.service';
import { PagosService } from 'src/pagos/services/pagos.service';
 
  const configService = new ConfigService();
 
 


 
@Injectable()
export class valid_payService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Sale) private saleRepository: Repository<Sale>,
        @InjectRepository(Referral) private referralRepository: Repository<Referral>,
        private readonly referralService:referralService,
        private readonly payService:PagosService
    ){

       
    }

     


     async update( data: any  ){
     console.log(data)

        let referreldata:CreateReferralDto
        const fecha = new Date();
        const mesActual = fecha.getMonth();
        fecha.setMonth(mesActual + 1);
        const anio = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque es base 0, y padStart para 2 dígitos
        const dia = fecha.getDate().toString().padStart(2, '0');

        const fechaFormateada = `${anio}-${mes}-10`;

     const saleinfo= await  this.saleRepository.findOne({where:{n_transaccion:data.order_id}})
     const usersProf= await  this.usersRepository.find({ where:{roles:{id:"PROF"}},relations:["roles"]})
     // luis22742632@gmail.com  rangelj086@gmail.com  2maibarra@gmail.com  sergiojcristanchoa@hotmail.com   itspipegiraldo@gmail.com
     console.log(saleinfo)
     saleinfo.status=data.payment_status
     
     if(data.payment_status=="finished")
     {
       
       
       const userinfo= await  this.usersRepository.findOne({where:{id:saleinfo.id_user }})
       userinfo.estado=1
       userinfo.estadoweb=1
       userinfo.time_limit=new Date(fechaFormateada)
       userinfo.time_limit_web=new Date(fechaFormateada)
       this.usersRepository.save(userinfo)
                            //calcular las comisiones de 2 niveles 
                                            //nivel 1
                                            if(userinfo.referrerId){
                                            referreldata.status='pendiente'
                                            referreldata.referrerId=userinfo.referrerId
                                            referreldata.referredUserId=userinfo.id
                                            referreldata.monto=50*0.1
                                            this.referralRepository.create()}
                                               
                                                //nivel 2
                                                   const userinfon2= await  this.usersRepository.findOne({where:{id:userinfo.referrerId }})
                                                    if(userinfo.referrerId){
                                                            referreldata.status='pendiente'
                                                            referreldata.referrerId=userinfon2.referrerId
                                                            referreldata.referredUserId=userinfon2.id
                                                            referreldata.monto=50*0.05
                                                            this.referralRepository.create()}
                                                         
                                                       
                                                
                                                         



       this.referralRepository.create()

     }
     this.saleRepository.save(saleinfo)
      
    //  console.log(fechaFormateada)
    //  console.log("payment_id")    
    //  console.log(data.payment_id)  
    //  console.log("paymentstatus")  
    //  console.log(data.payment_status)  
    //  console.log("order_id")  
    //  console.log(data.order_id)  
     
   
     
 
        return data    
      }

     async Create(id:number){
       let user= await this.usersRepository.findOne({where:{id:id},select:{wallet:true,}})
       let amount= await this.referralService.getsumacomisionestotal(id);
    //    console.log(configService.get('USERNOWPAYMENTS'))
    //    console.log(user)
    //    console.log(amount) 
    //     console.log(configService.get('PASSNOWPAYMENTS'))
    //     console.log(id)


     return await this.payService.createpay({address:user.wallet,amount:amount.totalPrice,currency:'usdtbsc',ipn_callback_url:"https://nowpayments.io"})
 
     }

     
     
      



 

  
 


 
}

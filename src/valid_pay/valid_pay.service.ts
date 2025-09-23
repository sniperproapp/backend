import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
 
import { InjectRepository } from '@nestjs/typeorm';
import {   Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { Sale } from 'src/sale/sale.entity';
import { Referral } from 'src/referral/referral.entity';
import { CreateReferralDto } from './dto/create-referral.dto';
 
 
 
 


 
@Injectable()
export class valid_payService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Sale) private saleRepository: Repository<Sale>,
        @InjectRepository(Referral) private referralRepository: Repository<Referral>,
    ){}

     


     async update( data: any  ){
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
     console.log(usersProf)
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
                                                            referreldata.monto=50*0.15
                                                            this.referralRepository.create()}
                                                         
                                                       
                                                        //nivel 3
                                                         



       this.referralRepository.create()

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

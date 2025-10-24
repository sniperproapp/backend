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
     let dataprofe:number[]=[24,110,942,2149]
        let referreldata:CreateReferralDto ={
            status: '',
            referrerId: 0,
            monto: 0,
            referredUserId: 0
        }
        
       

     let saleinfo= await  this.saleRepository.findOne({where:{n_transaccion:data.order_id}})
     if(saleinfo.estadorecibido==1)
     {console.log("ya este pago fue validado ")
        return}
     const usersProf= await  this.usersRepository.find({ where:{roles:{id:"PROF"}},relations:["roles"]})
     // luis22742632@gmail.com  rangelj086@gmail.com  2maibarra@gmail.com  sergiojcristanchoa@hotmail.com   
    console.log(saleinfo)
     saleinfo.status=data.payment_status
     if(data.outcome_amount!=50)
     {


                    if(data.payment_status=="finished")
                        {
                            const userinfo= await  this.usersRepository.findOne({where:{id:saleinfo.id_user }})

                            if(data.outcome_amount==400 || data.outcome_amount==200 ){//activar la app de señales por un año
                                           const fecha = new Date();
                                            const mesActual = fecha.getMonth();
                                            fecha.setMonth(mesActual + 12);
                                            const anio = fecha.getFullYear();
                                            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque es base 0, y padStart para 2 dígitos
                                            const dia = fecha.getDate().toString().padStart(2, '0');

                                            const fechaFormateada = `${anio}-${mes}-10`;

                                     
                                     userinfo.estado=1
                                     userinfo.estadomensualidad=1
                                    //userinfo.estadoweb=1
                                    userinfo.time_limit=new Date(fechaFormateada)
                                    // userinfo.time_limit_web=new Date(fechaFormateada)
                                    this.usersRepository.save(userinfo)

                            } 
                            if(data.outcome_amount==499 || data.outcome_amount==249 ){//activar la app de señales y la web por dos meses 
                                            const fecha = new Date();
                                            const mesActual = fecha.getMonth();
                                            fecha.setMonth(mesActual + 2);
                                            const anio = fecha.getFullYear();
                                            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque es base 0, y padStart para 2 dígitos
                                            const dia = fecha.getDate().toString().padStart(2, '0');

                                            const fechaFormateada = `${anio}-${mes}-10`;
                                    
                                    userinfo.estado=1
                                    userinfo.estadomensualidad=1
                                    userinfo.estadoweb=1
                                    userinfo.time_limit=new Date(fechaFormateada)
                                    userinfo.time_limit_web=new Date(fechaFormateada)
                                    this.usersRepository.save(userinfo)

                                
                            }


                             if(data.outcome_amount==2000 || data.outcome_amount==1000){//activar la app de señales y la web por 3 meses 
                                            const fecha = new Date();
                                            const mesActual = fecha.getMonth();
                                            fecha.setMonth(mesActual + 3);
                                            const anio = fecha.getFullYear();
                                            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque es base 0, y padStart para 2 dígitos
                                            const dia = fecha.getDate().toString().padStart(2, '0');

                                            const fechaFormateada = `${anio}-${mes}-10`;
                                    
                                    userinfo.estado=1
                                    userinfo.estadomensualidad=1
                                    userinfo.estadoweb=1
                                    userinfo.time_limit=new Date(fechaFormateada)
                                    userinfo.time_limit_web=new Date(fechaFormateada)
                                    this.usersRepository.save(userinfo)

                                
                            }


                        
                        
                      
                                                //calcular las comisiones de 2 niveles 
                                                            //nivel 1
                                                            if(userinfo.referrerId>0){
                                                            referreldata.status='finished'
                                                            referreldata.referrerId=userinfo.referrerId
                                                            referreldata.referredUserId=userinfo.id
                                                            referreldata.monto= data.outcome_amount *0.15
                                                            let referral1 = await this.referralRepository.create(referreldata)
                                                            let savereferral1= await this.referralRepository.save(referral1)
                                                        }
                                                            
                                                                //nivel 2
                                                                const userinfon2= await  this.usersRepository.findOne({where:{id:userinfo.referrerId }})
                                                                   
                                                                if(userinfon2.id==42){// si el referente es la maquina se le da 3% a el y dos a los hijos
                                                                     if(userinfo.referrerId>0){ //3%para miguel
                                                                            referreldata.status='finished'
                                                                            referreldata.referrerId=42
                                                                            referreldata.referredUserId=userinfon2.id
                                                                            referreldata.monto=data.outcome_amount*0.03
                                                                            let referral2 = await this.referralRepository.create(referreldata)
                                                                            let savereferral2= await this.referralRepository.save(referral2)}
                                                                     if(userinfo.referrerId>0){// 2%para los hijos
                                                                            referreldata.status='finished'
                                                                            referreldata.referrerId=4141
                                                                            referreldata.referredUserId=userinfon2.id
                                                                            referreldata.monto=data.outcome_amount*0.02
                                                                            let referral2 = await this.referralRepository.create(referreldata)
                                                                            let savereferral2= await this.referralRepository.save(referral2)}
                                                                }else{

                                                                      if(userinfo.referrerId>0){
                                                                            referreldata.status='finished'
                                                                            referreldata.referrerId=userinfon2.referrerId
                                                                            referreldata.referredUserId=userinfon2.id
                                                                            referreldata.monto=data.outcome_amount*0.05
                                                                            let referral2 = await this.referralRepository.create(referreldata)
                                                                            let savereferral2= await this.referralRepository.save(referral2)}
                                                                        

                                                                }
                                                                
                                                                
                                                                    
                                                                //calculo de porcentaje para profesores
                                                                     dataprofe.forEach(async element  => {
                                                                        referreldata.status='finished'
                                                                            referreldata.referrerId=element
                                                                            referreldata.referredUserId=userinfo.id
                                                                            referreldata.monto=data.outcome_amount*0.0125
                                                                            let referral3 = await this.referralRepository.create(referreldata)
                                                                            let savereferral3= await this.referralRepository.save(referral3)
                                                                    
                                                                     }); 

                                                                            
                                                                    
                                                                   
                                                                          
                                                                        



       
                                    saleinfo.estadorecibido=1;
                        }
   
        
        }else{// solo pago de mensualidad


            if(data.payment_status=="finished")
                        {
                           
              const userinfo= await  this.usersRepository.findOne({where:{id:saleinfo.id_user }})
              const fecha = new Date();
                                            const mesActual = fecha.getMonth();
                                            fecha.setMonth(mesActual + 1);
                                            const anio = fecha.getFullYear();
                                            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque es base 0, y padStart para 2 dígitos
                                            const dia = fecha.getDate().toString().padStart(2, '0');

                                            const fechaFormateada = `${anio}-${mes}-10`;
                                    
                                    userinfo.estado=1
                                    userinfo.estadomensualidad=1
                                    userinfo.estadoweb=1
                                    userinfo.time_limit=new Date(fechaFormateada)
                                    userinfo.time_limit_web=new Date(fechaFormateada)
                                    this.usersRepository.save(userinfo)


                                    saleinfo.estadorecibido=1;
          }
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


    const respuesta=  await this.payService.createpay({address:user.wallet,amount:amount.totalPrice,currency:'usdtbsc',ipn_callback_url:"https://nowpayments.io"})
 
      if(respuesta=='OK')
      {

        let respuesta=await this.referralService.cambiodeestadopagado(id)
        console.log(respuesta)

         throw new HttpException('El pago fue realizado con éxito',HttpStatus.OK);
      }else{
        return respuesta
      }
  
     }

     
     
      



 

  
 


 
}

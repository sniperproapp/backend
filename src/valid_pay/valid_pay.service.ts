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
import { Saleproducto } from 'src/sales_producto/saleproducto.entity';
import { InventarioService } from 'src/inventario/services/Inventario.service';
 
  const configService = new ConfigService();
 
 


 
@Injectable()
export class valid_payService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Saleproducto) private saleproducRepository: Repository<Saleproducto>,
        @InjectRepository(Referral) private referralRepository: Repository<Referral>,
        private readonly referralService:referralService,
        private readonly inventarioService:InventarioService,
        private readonly payService:PagosService
    ){

       
    }

     


     async update( data: any  ){
     console.log(data)
   
        
       

     let saleproducinfo= await  this.saleproducRepository.findOne({where:{n_transaccion:data.order_id},relations:["saledetailsproduc"]})
     console.log(saleproducinfo.saledetailsproduc[0])
     console.log(saleproducinfo.saledetailsproduc[0].id_producto)
     if(saleproducinfo.estadorecibido==1)
     {console.log("ya este pago fue validado ")
        return}
     const usersProf= await  this.usersRepository.find({ where:{roles:{id:"PROF"}},relations:["roles"]})
     // luis22742632@gmail.com  rangelj086@gmail.com  2maibarra@gmail.com  sergiojcristanchoa@hotmail.com   
    console.log(saleproducinfo)
     saleproducinfo.status=data.payment_status

          saleproducinfo.saledetailsproduc.forEach(async element => {
           
           
           
            if(data.payment_status=="finished")
          {
                  const userinfo= await  this.usersRepository.findOne({where:{id:saleproducinfo.id_user }})
             
             
                  if(element.id_producto==19)// mensualidad id
                  {
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


                                    saleproducinfo.estadorecibido=1;
                           }
                




                
                    
                            //master elite       
                            if(element.id_producto==16 ){//activar la app de señales y la web por dos meses 
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
                                    this.calcular_comision(saleproducinfo.id_user,data.outcome_amount) 
                                    saleproducinfo.estadorecibido=1;
                            }
           


                 
                                          //si el id es igual al de infiniti sniper
                                  if(element.id_producto==14){//activar la app de señales por un año
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
                                    this.calcular_comision(saleproducinfo.id_user,data.outcome_amount) 
                                    saleproducinfo.estadorecibido=1;
                               } 
                         
                
               
               
                            //si el id es igual al de FULL SNIPER
                           if(element.id_producto==17){//activar la app de señales y la web por 3 meses 
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
                                    this.calcular_comision(saleproducinfo.id_user,data.outcome_amount) 
                                    saleproducinfo.estadorecibido=1;
                            }
                        
               


                              if(element.productos.tipo_articulo=="Fisico" ){
                                
                                 this.inventarioService.update(element.productos.inventario.id_inventario,element.n_cantidad)
                              }

                    }



  
});

    
     
     this.saleproducRepository.save(saleproducinfo)
        
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

     
     
      

  async calcular_comision(id_user,outcome_amount){//data.outcome_amount
    let dataprofe:number[]=[24,110,942,2149]
        let referreldata:CreateReferralDto ={
            status: '',
            referrerId: 0,
            monto: 0,
            referredUserId: 0
        }

  const userinfo= await  this.usersRepository.findOne({where:{id:id_user }})
   //calcular las comisiones de 2 niveles 
                                                            //nivel 1
                                                            if(userinfo.referrerId>0){
                                                            referreldata.status='finished'
                                                            referreldata.referrerId=userinfo.referrerId
                                                            referreldata.referredUserId=userinfo.id
                                                            referreldata.monto= outcome_amount *0.15
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
                                                                            referreldata.monto=outcome_amount*0.03
                                                                            let referral2 = await this.referralRepository.create(referreldata)
                                                                            let savereferral2= await this.referralRepository.save(referral2)}
                                                                     if(userinfo.referrerId>0){// 2%para los hijos
                                                                            referreldata.status='finished'
                                                                            referreldata.referrerId=4141
                                                                            referreldata.referredUserId=userinfon2.id
                                                                            referreldata.monto=outcome_amount*0.02
                                                                            let referral2 = await this.referralRepository.create(referreldata)
                                                                            let savereferral2= await this.referralRepository.save(referral2)}
                                                                }else{

                                                                      if(userinfo.referrerId>0){
                                                                            referreldata.status='finished'
                                                                            referreldata.referrerId=userinfon2.referrerId
                                                                            referreldata.referredUserId=userinfon2.id
                                                                            referreldata.monto=outcome_amount*0.05
                                                                            let referral2 = await this.referralRepository.create(referreldata)
                                                                            let savereferral2= await this.referralRepository.save(referral2)}
                                                                        

                                                                }
                                                                
                                                                
                                                                    
                                                                //calculo de porcentaje para profesores
                                                                     dataprofe.forEach(async element  => {
                                                                        referreldata.status='finished'
                                                                            referreldata.referrerId=element
                                                                            referreldata.referredUserId=userinfo.id
                                                                            referreldata.monto=outcome_amount*0.0125
                                                                            let referral3 = await this.referralRepository.create(referreldata)
                                                                            let savereferral3= await this.referralRepository.save(referral3)
                                                                    
                                                                     }); 

}

 

  
 


 
}

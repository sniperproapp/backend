import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
import  storage = require( '../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
 
 
import { updatesectionCursosDto } from './dto/update-sectionCursosDto';
 
import { Sale } from './sale.entity';
import { Carrito } from 'src/carrito_de_compras/Carrito.entity';
import { CreateSaleDto } from './dto/create-saleDto';
import { Saledetail } from 'src/saledetail/saledetail.entity';
import { CreateCarritoDto } from 'src/carrito_de_compras/dto/Create-carrito.dto';
import { CreateCarritoDetailDto } from './dto/Create-carritodetail.dto';
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
import { MailsService } from 'src/mails/mails.service';
import { PagosService } from 'src/pagos/services/pagos.service';
 
 
  
 
@Injectable()
export class saleService {
    constructor(
        @InjectRepository(Sale) private saleRepository: Repository<Sale>
        ,@InjectRepository(Cursostudent) private cursostudentsRepository: Repository<Cursostudent>
        ,@InjectRepository(Carrito) private carritosRepository: Repository<Carrito>
        ,@InjectRepository(User) private usersRepository: Repository<User>
        ,@InjectRepository(Saledetail) private saledetailsRepository: Repository<Saledetail>,
        private mailservices: MailsService,private pagosservices:PagosService
    ){}

    async findAll(id:number){
      
       // return this.SectionRepository.find({where:{id_curso:id} });
    }
    
      
       
     
    async inscribir(idcurso:number,iduser:number){

          let Sale = await this.saleRepository.create({
            method_payment:'usdt',currency_total:'30',currency_payment:'usdt',total:0,

            price_dolar:0,n_transaccion:'000',id_user:iduser });
         let saleinfo= await this.saleRepository.save(Sale);
            
            let saldetalle:CreateCarritoDetailDto ={type_discount:0,discount:0,id_sale:saleinfo.id,campaign_discount:0,
              code_cupon:'',code_discount:'',price_unit:0,subtotal:0,total:0,id_user:iduser,id_curso:idcurso
            }
             
            saldetalle.id_sale = Sale.id;
            let guardardetalle= await this.saledetailsRepository.create(saldetalle);
            await this.saledetailsRepository.save(guardardetalle);
         let guardarusercurso= await this.cursostudentsRepository.create({
              id_user: iduser,
              id_curso: idcurso
         })

            this.cursostudentsRepository.save(guardarusercurso);
 
   throw new HttpException('INSCRITO CORRECTAMENTE ',HttpStatus.OK);
 
}

   
    

   
     

   

    async create(sale:CreateSaleDto){

        let data={merchantTradeNo:"11",orderAmountnumber:sale.total}
        let infopagos = await this.pagosservices.create(data)
        let userinfo = await this.usersRepository.findOneBy({id: sale.id_user})
        sale.id_user=userinfo.id;
        sale.currency_payment="usdt"
        sale.method_payment="nowpaymenst"
        sale.n_transaccion=infopagos.order_id
        sale.status="NEW"

        let Sale = await this.saleRepository.create(sale);
       let salesready= await this.saleRepository.save(Sale);
       let detallepago= await this.saledetailsRepository.create({
         price_unit:	sale.total,subtotal:sale.total,	total:sale.total,	id_sale:salesready.id,	id_curso:sale.id_curso	
       })
      let detallesave = await this.saledetailsRepository.save(detallepago);
     
       let orden={total:sale.total,id:infopagos.order_id,name:userinfo.name,lastname:userinfo.lastname,method_payment:"NOWPAYMES",link:infopagos.invoice_url,  } 
      let Cart = await this.carritosRepository.findOne({where:{id_user: sale.id_user}});
        await this.carritosRepository.delete( Cart.id);
        this.mailservices.sendmaillinkdepago(orden,userinfo.email)

        // IRIA EL ENVIO DE EMAIL
        //await send_email(Sale._id);
      //  let ordendetail = await this.saledetailsRepository.find({relations:['cursos'], where:{id_sale: Sale.id}});
      //  let orden = await this.saleRepository.findOne({relations:['user'], where:{id: Sale.id}});
       // let usuario = await this.usersRepository.findOne({ where:{id: iduser}});
      // await this.mailservices.sendmail(orden,ordendetail,usuario.email);

            throw new HttpException(infopagos.invoice_url,HttpStatus.OK);
   
}

     
      
 
     
      
       
      
     


     




     async update( id: number,section:updatesectionCursosDto){
        
      
     

        const categorifound= await this.saleRepository.findOneBy({id: id})
        if(!categorifound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.OK);
 
        }
         console.log(section);
         console.log(categorifound
          
         );

      
        return this.saleRepository.save(categorifound);
      }

      async delete(id: number){

        const categorifound = await this.saleRepository.findOneBy({id: id})
        if(!categorifound){
            throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
    
           }
       
        return this.saleRepository.delete(id);

    }


    

}

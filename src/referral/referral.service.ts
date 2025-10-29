import { ConsoleLogger, HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
 
import { InjectRepository } from '@nestjs/typeorm';
import {   Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { Sale } from 'src/sale/sale.entity';
import { Referral } from 'src/referral/referral.entity';
 
import { PagosService } from 'src/pagos/services/pagos.service';
 
 
 
 
 


 
@Injectable()
export class referralService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Referral) private referralRepository: Repository<Referral>,
        private pagosservices:PagosService
    ){}

     
  async getlistn1( id: number  ){
 
     const query = `
      WITH RECURSIVE referred_chain AS (
        SELECT
          id AS userId,
          referrerId,
          name,
          imagen,
          1 AS level
        FROM
          users
        WHERE
          id =${id}

        UNION ALL

        SELECT
          u.id AS userId,
          u.referrerId,
              u.name,
          u.imagen,
          rc.level + 1 AS level
        FROM
          users u
        JOIN
          referred_chain rc ON u.referrerId = rc.userId
        WHERE
          rc.level < 3
      )
      SELECT
        userId,
        level,imagen,name
      FROM
        referred_chain
      WHERE
        level > 1;
    `;

    return this.usersRepository.query(query);
  }



async getsumacomisiones(id:number){
  return  this.referralRepository.createQueryBuilder('referral')
      .select('SUM(referral.monto)', 'totalPrice') // 1. Selecciona la suma y le da un alias
      .where('referral.estado = :estado && referral.referrerId = :referrerId ' , { estado: 1,referrerId:id }) // 2. Aplica la condición WHERE
      .getRawOne(); // 3. Obtiene el resultado
}



async getsumacomisionestotal(id:number){
  return  this.referralRepository.createQueryBuilder('referral')
      .select('SUM(referral.monto)', 'totalPrice') // 1. Selecciona la suma y le da un alias
      .where('referral.estado = :estado && referral.referrerId = :referrerId &&  referral.status = :status' , { estado: 0,referrerId:id,status:"finished" }) // 2. Aplica la condición WHERE
      
      .getRawOne(); // 3. Obtiene el resultado
}



async getsumacomisionestotalalluser(){

let  data= []

   let balances = await this.pagosservices.getbalance();
 
 
 
  let comisiones = await this.referralRepository.createQueryBuilder('referral')
          .select('SUM(referral.monto)', 'totalPrice') // 1. Selecciona la suma y le da un alias
       .where('referral.estado = :estado  &&  referral.status = :status' , { estado: 0,status:"finished" }) // 2. Aplica la condición WHERE
      
       .getRawOne(); // 3. Obtiene el resultado
data.push({
  comisiones:comisiones,
  balances:balances
})
 


       return   data
}

async cambiodeestadopagado(id:number){
  return  this.referralRepository.createQueryBuilder()
        // 2. Definir la acción como UPDATE
        .update('referral')
        // 3. Establecer los nuevos valores para el/los campo/s
        .set({ estado: 1 })
        // 4. Definir la condición WHERE (actualiza SOLO donde el estado sea el anterior)
      .where('referral.estado = :estado && referral.referrerId = :referrerId &&  referral.status = :status' , { estado: 0,referrerId:id,status:"finished" }) // 2. Aplica la condición WHERE
      // 5. Ejecutar la consulta en la base de datos
        .execute();
      
 
}


  async getlist( id: number  ){
 
     return this.referralRepository.find({where:{referrerId:id}});
  }

 
 
}

import { ConsoleLogger, HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
 
import { InjectRepository } from '@nestjs/typeorm';
import {   Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { Sale } from 'src/sale/sale.entity';
import { Referral } from 'src/referral/referral.entity';
 
 
 
 
 


 
@Injectable()
export class referralService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Sale) private saleRepository: Repository<Sale>,
        @InjectRepository(Referral) private referralRepository: Repository<Referral>,
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

  async getlist( id: number  ){
 
     return this.referralRepository.find({where:{referrerId:id}});
  }

 
 
}

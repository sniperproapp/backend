import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
 
import { User } from 'src/users/user.entity';
import {  valid_payService } from './valid_pay.service';
import {    valid_payController } from './valid_pay.controller';
import { Sale } from 'src/sale/sale.entity';
import { Referral } from 'src/referral/referral.entity';
 
 
 
 
 

@Module({
  imports:[TypeOrmModule.forFeature([User,Sale,Referral])],
  providers: [valid_payService,JwtStrategy],
  controllers: [valid_payController]
})
export class valid_payModule {}

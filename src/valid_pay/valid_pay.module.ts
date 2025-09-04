import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
 
import { User } from 'src/users/user.entity';
import {  valid_payService } from './valid_pay.service';
import {    valid_payController } from './valid_pay.controller';
 
 
 
 
 

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  providers: [valid_payService,JwtStrategy],
  controllers: [valid_payController]
})
export class valid_payModule {}

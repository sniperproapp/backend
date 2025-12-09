import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
 
import { User } from 'src/users/user.entity';
import {  valid_payService } from './valid_pay.service';
import {    valid_payController } from './valid_pay.controller';
import { Sale } from 'src/sale/sale.entity';
import { Referral } from 'src/referral/referral.entity';
import { referralService } from 'src/referral/referral.service';
import { PagosService } from 'src/pagos/services/pagos.service';
import { Saleproducto } from 'src/sales_producto/saleproducto.entity';
import { InventarioService } from 'src/inventario/services/Inventario.service';
import { Inventario } from 'src/inventario/Inventario.entity';
 
 
 
 
 

@Module({
  imports:[TypeOrmModule.forFeature([User,Saleproducto,Referral,Inventario])],
  providers: [valid_payService,JwtStrategy,referralService,InventarioService,PagosService],
  controllers: [valid_payController]
})
export class valid_payModule {}

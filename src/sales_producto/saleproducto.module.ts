import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
 
import {    Saleproducto } from './saleproducto.entity';
 
import { Carrito } from 'src/carrito_de_compras/Carrito.entity';
import { Saledetail } from 'src/saledetail/saledetail.entity';
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
import { MailsService } from 'src/mails/mails.service';
import { PagosService } from 'src/pagos/services/pagos.service';
import { saleproductoService } from './saleproducto.service';
import { saleproductoController } from './sale_producto.controller';
import { Saledetailproduc } from 'src/salesdetalleproducto/saledetailproduc.entity';
 
 
 

@Module({
  imports:[TypeOrmModule.forFeature([Saleproducto,Cursostudent,Carrito,Saledetailproduc,User]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [saleproductoService,JwtStrategy,MailsService,MailsService,PagosService],
  controllers: [saleproductoController]
})
export class saleproductoModule {}

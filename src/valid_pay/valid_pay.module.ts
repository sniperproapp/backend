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
import { Video_paid } from 'src/videos_paid/video_paid.entity';
import { CursosService } from 'src/cursos/Cursos.service';
import { CursosModule } from 'src/cursos/Cursos.module';
import { Cursos } from 'src/cursos/Cursos.entity';
import { CategoryCursos } from 'src/categoriesCursos/categoryCursos.entity';
import { DescuentoCursos } from 'src/descuento/descuentoCursos.entity';
import { Reviews } from 'src/reviews/reviews.entity';
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
import { SectionCursos } from 'src/section/SectionCursos.entity';
import { saleService } from 'src/sale/sale.service';
import { Carrito } from 'src/carrito_de_compras/Carrito.entity';
import { Saledetail } from 'src/saledetail/saledetail.entity';
import { MailsService } from 'src/mails/mails.service';
import { Video_paidService } from 'src/videos_paid/video_paid.service';
 
 
 
 
 

@Module({
  imports:[TypeOrmModule.forFeature([User,Saleproducto,Referral,Inventario,Video_paid,Cursos,SectionCursos,CategoryCursos,DescuentoCursos,Cursostudent,Reviews,   Sale,   Carrito,   Saledetail])  ],
  providers: [valid_payService,Video_paidService,JwtStrategy,referralService,InventarioService,PagosService,CursosService,saleService,MailsService],
  controllers: [valid_payController],
   
})
export class valid_payModule {}

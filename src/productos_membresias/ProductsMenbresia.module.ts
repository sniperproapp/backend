import { Module } from '@nestjs/common';
import {   ProductsMenbresiaController } from './ProductsMenbresia.controller';
import { ProductsMenbresiaService    } from './productsmenbresia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  ProductsMenbresia } from './ProductsMenbresia.entity';
import { Category } from 'src/categories/category.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { User } from 'src/users/user.entity';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
import { MembresiasService } from 'src/membresias/services/Membresias.service';
import { InventarioService } from 'src/inventario/services/Inventario.service';
import { PlanMembresia } from 'src/membresias/Membresias.entity';
import { Inventario } from 'src/inventario/Inventario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductsMenbresia,User,PlanMembresia,Inventario ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  controllers: [ProductsMenbresiaController],
  providers: [ProductsMenbresiaService,JwtStrategy,MembresiasService,InventarioService]
})
export class ProductsMenbresiaModule {}

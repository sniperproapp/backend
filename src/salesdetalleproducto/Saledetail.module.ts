import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { User } from 'src/users/user.entity';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
 
 
 
import { CuponCursos } from 'src/cupones/cuponCursos.entity';
import { Saledetailproduc } from './saledetailproduc.entity';
import { SaledetailproducService } from './Saledetailproduc.service';
import { SaledetailproducController } from './saledetailproduc.controller';

@Module({
  imports:[TypeOrmModule.forFeature([Saledetailproduc,User,CuponCursos ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  controllers: [SaledetailproducController],
  providers: [SaledetailproducService,JwtStrategy]
})
export class SaledetailproducModule {}

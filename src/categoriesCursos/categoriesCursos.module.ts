import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
import { CategoriesCursosService } from './categories_cursos.service';
import { CategoriesCursosController } from './categoriesCursos.controller';
import { CategoryCursos } from './categoryCursos.entity';
import { Cursos } from 'src/cursos/Cursos.entity';
import { DescuentoCursos } from 'src/descuento/descuentoCursos.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CategoryCursos,User,Cursos,DescuentoCursos]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [CategoriesCursosService,JwtStrategy],
  controllers: [CategoriesCursosController]
})
export class CategoriesCursosModule {}

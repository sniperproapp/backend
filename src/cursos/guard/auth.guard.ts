// src/auth/auth.guard.ts
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
 
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/user.entity';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';

@Injectable()
export class EstadoWebAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado.');
    }

  
      const secret = jwtConstants.secret;
      const payload = jwt.verify(token, secret) as { id: number };
      
      // 🔑 VALIDACIÓN EN LA BASE DE DATOS
      const user = await this.usersRepository.findOne({
        where: { id: payload.id },
      });
console.log(user)
      if (user.estadoweb == 0) {
        throw new HttpException("Paga la Mensualidad para seguir disfrutando de la educacion ",HttpStatus.OK);
      }
       

     
    return true;
  }
  
  private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
  }
}
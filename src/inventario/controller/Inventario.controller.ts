import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InventarioService    } from '../services/Inventario.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { CreatecuponCursosDto } from 'src/cupones/dto/create-cuponCursosDto';
 
 

@Controller('Inventario')
export class InventarioController {
    constructor(private readonly inventarioservices: InventarioService) {}

   
 

}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MembresiasService } from '../services/Membresias.service';

 

@Controller('Membresias')
export class MembresiasController {
    constructor(private readonly Membresiasservices: MembresiasService) {}

   
 


}

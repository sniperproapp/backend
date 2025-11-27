import { Injectable, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatemembresiaDto    } from '../dto/createpagosDto';
 
import { InjectRepository } from '@nestjs/typeorm';
 
import { Repository } from 'typeorm';
import { PlanMembresia } from '../Membresias.entity';
 
  
  
@Injectable()
export class MembresiasService {
 
constructor(@InjectRepository(PlanMembresia) private planMembresiaRepository: Repository<PlanMembresia> ) {
    
   
 
  }
 
    
  
     
      

    async create(  menbresia: CreatemembresiaDto){
  
      let newmembresia = this.planMembresiaRepository.create( menbresia);
      return this.planMembresiaRepository.save(menbresia);
    }







 
}

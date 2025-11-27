import { Module } from '@nestjs/common';
import { MembresiasController } from './controller/membresia.controller';
import { MembresiasService } from './services/Membresias.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanMembresia } from './Membresias.entity';
 

@Module({
   imports:[TypeOrmModule.forFeature([PlanMembresia])],
  providers: [MembresiasService],
  controllers: [MembresiasController],
  exports: [MembresiasService],
})
export class MembresiasModule {}

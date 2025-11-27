import { Module } from '@nestjs/common';
import { InventarioController } from './controller/Inventario.controller';
import { InventarioService } from './services/Inventario.service';
 

@Module({
  providers: [InventarioService],
  controllers: [InventarioController],
  exports: [InventarioService],
})
export class InventarioModule {}

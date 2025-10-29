import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
 
import { User } from 'src/users/user.entity';
 
 
 
import { Referral } from 'src/referral/referral.entity';
import { referralService } from './referral.service';
import { referralController } from './referral.controller';
import { PagosService } from 'src/pagos/services/pagos.service';
 
 
 
 
 

@Module({
  exports:[referralService],
  imports:[TypeOrmModule.forFeature([User,Referral])],
  providers: [referralService,PagosService],
  controllers: [referralController]
})
export class referralModule {}

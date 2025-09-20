import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
 
import { User } from 'src/users/user.entity';
 
 
import { Sale } from 'src/sale/sale.entity';
import { Referral } from 'src/referral/referral.entity';
import { referralService } from './referral.service';
import { referralController } from './referral.controller';
 
 
 
 
 

@Module({
  exports:[referralService],
  imports:[TypeOrmModule.forFeature([User,Sale,Referral])],
  providers: [referralService,JwtStrategy],
  controllers: [referralController]
})
export class referralModule {}

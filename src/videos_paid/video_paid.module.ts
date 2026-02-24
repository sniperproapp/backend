import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
 
 
import { Video_paid } from './video_paid.entity';
import { User } from 'src/users/user.entity';
import { Video_paidController } from './video_paid.controller';
import { Video_paidService } from './video_paid.service';
 

@Module({
  imports:[TypeOrmModule.forFeature([Video_paid,User ])],
  providers: [Video_paidService],
  controllers: [Video_paidController]
})
export class Video_paidModule {}

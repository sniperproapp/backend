import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
 
 
import { Zoom } from './zoom.entity';
import { ZoomController } from './zoom.controller';
import { ZoomService } from './zoom.service';
import { EventsGateway } from 'src/comunication/events.gateway';

@Module({
  imports:[TypeOrmModule.forFeature([Zoom ])],
  providers: [ZoomService,EventsGateway,JwtStrategy],
  controllers: [ZoomController]
})
export class ZoomModule {}

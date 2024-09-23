import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));
  const cors = require('cors');
  app.use(cors()); 
  app.useGlobalPipes(new ValidationPipe({forbidUnknownValues: false}));
   const port = app.get(ConfigService)
  await app.listen(port.get('PORT'),'0.0.0.0' || 'localhost');
  console.log(`Aplication running on: ${await app.getUrl()}`)
   
}
bootstrap();

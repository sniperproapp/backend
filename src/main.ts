import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');
  app.use(cors()); 
  app.useGlobalPipes(new ValidationPipe({forbidUnknownValues: false}));
   
  await app.listen(4000,'0.0.0.0' || 'localhost');
  //await app.listen(4000,'10.0.0.229' || 'localhost');
}
bootstrap();

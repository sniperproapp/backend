import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { MailsModule } from './mails/mails.module';
import { ConfigModule } from '@nestjs/config';
import { VideoModule } from './video/video.module';
import { ZoomModule } from './ZOOM/zoom.module';
 

@Module({
  imports: [ConfigModule.forRoot({envFilePath: '.env',isGlobal:true}), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'sniperpro.cpqme4wayqxv.us-west-2.rds.amazonaws.com', //produccion
     // host: 'sniperpro-dev.cpqme4wayqxv.us-west-2.rds.amazonaws.com',//developer
      port: 3306,
      username: 'admin',
      password: 'Gllv1992..', //producction
     // password: 'gllv1992..', // developer
      database: 'sniperpro',
      entities: [__dirname + '/**/*.entity{.ts,.js}' ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    VideoModule,
    ZoomModule,
    CategoriesModule,
    ProductsModule,
    MailsModule,
   
    
  ],
  exports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

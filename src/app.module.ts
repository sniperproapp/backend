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


 
@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'sniperpro.c2ayyv3boanv.us-west-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'Gllv1992..',
      database: 'sniperpro',
      entities: [__dirname + '/**/*.entity{.ts,.js}' ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    VideoModule,
    CategoriesModule,
    ProductsModule,
    MailsModule,
   
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

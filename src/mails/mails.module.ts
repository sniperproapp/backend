import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saledetail } from 'src/saledetail/saledetail.entity';
import { Sale } from 'src/sale/sale.entity';
 

 
 

@Module({
  exports:[MailsService],
  imports:[
    MailerModule.forRootAsync({
     useFactory: async (config:ConfigService)=>({
      transport:{
        host:'email-smtp.us-east-1.amazonaws.com',
        secure: true,
        port:465,
        auth:{user:'AKIA3FLDZQGMF3Z357HZ',pass:'BBIjRigHly7gaUhB2usxQSHNCpogkg0+nl0LHnKxwjR0',}
      },
      defaults:{from: `"NO REPLY" <info@sniperproacademy.com>`,},
      template:{dir: join(__dirname,'templates'),
    adapter: new HandlebarsAdapter(),
    options: { 
      strict: true,
            },
      },
     }),
     inject:[ConfigService]

    })
    
  ],
  providers: [MailsService,Saledetail,Sale],
})
export class MailsModule {}

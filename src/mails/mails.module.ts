import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

 
 

@Module({
  exports:[MailsService],
  imports:[
    MailerModule.forRootAsync({
     useFactory: async (config:ConfigService)=>({
      transport:{
        host:'sniperprotrading.com',
        secure: true,
        port:465,
        auth:{user:'info@sniperprotrading.com',pass:'+Info-Sniper*.',}
      },
      defaults:{from: `"NO REPLY" <info@sniperprotrading.com>`,},
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
  providers: [MailsService],
})
export class MailsModule {}

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
        host:'mail.tusoporteweb.cl',
        secure: true,
        port:465,
        auth:{user:'soporte@tusoporteweb.cl',pass:'Gllv1992..',}
      },
      defaults:{from: `"NO REPLY" <soporte@tusoporteweb.cl>`,},
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

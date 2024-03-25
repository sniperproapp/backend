import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
   
  constructor( private mailerservices: MailerService){}

  async senUserConfirmation( email:string){
    await this.mailerservices.sendMail({
      to:email,
      subject:"Recuperar Password",
      template:'./recueperarpass',
      context:{id:email}
      
    })
  }

  async welcome( email:string){
    await this.mailerservices.sendMail({
      to:email,
      subject:"Bienvenido a SNIPER PRO ",
      template:'./welcome',
      context:{id:email}
      
    })
  }
}

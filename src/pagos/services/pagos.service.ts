import { Injectable, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatepagosDto } from '../dto/createpagosDto';
import { authenticator } from 'otplib';
import { createpagosmasivoDto } from '../dto/createpagosmasivoDto';
const crypto = require('crypto');
const axios = require('axios');
// This is a very simple script working on Binance Pay API
// Set your apiKey and apiSecret, then you are ready to go.
const configService = new ConfigService();
const apiKey = configService.get('KEY_BINANCE') // set your API key here 
const apiKeynow = configService.get('KEY_NOWPAY') // set your API key here 
const apiSecret =configService.get('SECRE_KEY_BINANCE')// set your secret key here
const baseURL ='https://api.nowpayments.io/v1' //'https://bpay.binanceapi.com'
 
const NOWPAYMENTS_2FA_SECRET = process.env.NOWPAYMENTS_PAYOUT_SECRET;  
function hash_signature(query_string) {
    return crypto
        .createHmac('sha512', apiSecret)
        .update(query_string)
        .digest('hex');
  }
 
  

function random_string() {
    return crypto.randomBytes(32).toString('hex').substring(0,32);
  }
  
  async function dispatch_request(http_method, path, payload = {},token) {
      const timestamp = Date.now()
      const nonce = random_string()
      const payload_to_sign = timestamp + "\n" + nonce + "\n" + JSON.stringify(payload) + "\n"
      const url = baseURL + path
      const signature = hash_signature(payload_to_sign)
      return  await axios.create({
        baseURL,
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key':apiKeynow,
          
   
        }
      }).request({
        'method': http_method,
        url,
        data: payload
      })
  }



  async function dispatch_request_token(http_method, path, payload = {}) {
       const url = baseURL + path
   
      return  await axios.create({
        baseURL,
        headers: {
          'content-type': 'application/json',
          'x-api-key':apiKeynow,
           
        }
      }).request({
        'method': http_method,
        url,
        data: payload
      })
  }





  
  // ===== functions ======
  
  
 
  
 
  
  
@Injectable()
export class PagosService {

// auhttenticator
    async verifyPayout(batchId: string) {
        // 1. Obtener el código 2FA generado
        const verificationCode = this.generateVerificationCode();

        // 2. Construir la URL y el cuerpo de la solicitud
        const url = `https://api.nowpayments.io/v1/payout/${batchId}/verify`;
        const payload = {
            verification_code: verificationCode, // <-- Aquí se envía el código generado
        };

        // 3. Realizar la llamada a la API (usando axios o HttpService de NestJS)
        // ...
        // const response = await this.httpService.post(url, payload, { headers }).toPromise();
        // ...
    }
    generateVerificationCode(): string {
        if (!NOWPAYMENTS_2FA_SECRET) {
            throw new Error('NOWPAYMENTS_PAYOUT_SECRET no está configurado.');
        }

        // otplib genera el código TOTP basado en el secreto y el tiempo actual (cada 30 segundos)
        const verificationCode = authenticator.generate(NOWPAYMENTS_2FA_SECRET);

        return verificationCode;
    }

// auhttenticator fin
async createpay(data:createpagosmasivoDto){
        //validar address
       let address = await dispatch_request('POST', 
          '/payout/validate-address',
          {
            "address": data.address, 
            "currency": "usdtbsc", 
            "extra_id":null
            
       },""
        ).then(async response =>  {return await response.data}).catch(error =>  error)
      
        console.log(address)

      if(address!="OK"){
         return address.response.data ;
      }


      

        //obtener token
        console.log(configService.get('USERNOWPAYMENTS'))
        console.log(configService.get('PASSNOWPAYMENTS'))
       let token = await dispatch_request_token('POST', 
          '/auth',
          {
            "email":configService.get('USERNOWPAYMENTS') ,
            "password":configService.get('PASSNOWPAYMENTS') ,
            
       }
        ).then(async response =>  {return await response.data}).catch(error =>  error)
        
        // console.log("token")
        // console.log(token)
      let   createpaymasive:createpagosmasivoDto[]=[];
 
       createpaymasive.push(data)

        let mensaje=await  await dispatch_request(
          'POST', 
          '/payout',
          {
            "ipn_callback_url": "https://nowpayments.io",
           "withdrawals": createpaymasive
       },token.token
        ).then(async response =>  {return await response.data}).catch(error =>  error)
        console.log(mensaje)

  if(!mensaje.id){
     return mensaje
  }
   let code= await this.generateVerificationCode()
        console.log(code)


let mensajevalidarpago=await  await dispatch_request(
          'POST', 
          '/payout/'+mensaje.id+'/verify',
          {
            "verification_code": code
             
       },token.token
        ).then(async response =>  {return await response.data}).catch(error =>  error)


 
return  mensajevalidarpago
 


  
}
  async get2af(): Promise<any> {
 return await this.generateVerificationCode()
  }

      async create(pago:CreatepagosDto): Promise<any> {
        return  await dispatch_request(
          'POST', 
          '/invoice',
          {
            "price_amount":  pago.orderAmountnumber,
            "price_currency": "usd",
            "pay_currency": "usdtbsc",
            "ipn_callback_url": "https://sniperpro-backend.onrender.com/valid_pay/valid",
            "success_url":"https://sniperproacademy.com/auth/login",
            "order_id": random_string(),
            "order_description": "mensualidad"
       },""
        ).then(async response =>  {return await response.data}).catch(error =>  error)
        
      
     
      
     
     
          
     
     }









 
}

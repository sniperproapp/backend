import { Injectable, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatepagosDto } from '../dto/createpagosDto';
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
 
 
function hash_signature(query_string) {
    return crypto
        .createHmac('sha512', apiSecret)
        .update(query_string)
        .digest('hex');
  }


  
// ===== functions ======

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
        console.log(mensaje.response.data)
   return mensaje.response.data
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

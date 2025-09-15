import { Injectable, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatepagosDto } from '../dto/createpagosDto';
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
  
  async function dispatch_request(http_method, path, payload = {}) {
      const timestamp = Date.now()
      const nonce = random_string()
      const payload_to_sign = timestamp + "\n" + nonce + "\n" + JSON.stringify(payload) + "\n"
      const url = baseURL + path
      const signature = hash_signature(payload_to_sign)
      return  await axios.create({
        baseURL,
        headers: {
          'content-type': 'application/json',
         // 'BinancePay-Timestamp': timestamp,
          'x-api-key':apiKeynow,
          //'BinancePay-Nonce': nonce,
         // 'BinancePay-Certificate-SN': apiKey,
         // 'BinancePay-Signature': signature.toUpperCase()
        }
      }).request({
        'method': http_method,
        url,
        data: payload
      })
  }
  
  // ===== functions ======
  
  
  // Query Order
   
  // POST /binancepay/openapi/order/query
  // https://developers.binance.com/docs/binance-pay/api-order-query
  async function query_order(id:number) {
    return await dispatch_request(
      'POST', 
      '/binancepay/openapi/v2/order/query', 
      {
        "merchantTradeNo": id,
      }
    ).then(async response => {return await response.data}  ).catch(async error => {return await null})
   
  }
  
 
  
  
  // Create Order
  //
  // POST /binancepay/openapi/order
  // https://developers.binance.com/docs/binance-pay/api-order-create
  function create_order(pago:CreatepagosDto) {
   return 
  }
   // 'merchantId': pago.merchantId,
        // 'merchantTradeNo':pago.merchantTradeNo,
        // 'tradeType': pago.tradeType,
        // 'totalFee': pago.totalFee,
        // 'currency': pago.currency,
        // 'productType':pago.productType,
        // 'productName': pago.productName,
        // 'productDetail': pago.productDetail
  //create_order()
   
@Injectable()
export class PagosService {


    async getinfo(id:number): Promise<any> {

      return  await query_order(id);
        

       
      }



//       curl --location '' \
// --header 'x-api-key: {{api-key}}' \
// --header 'Content-Type: application/json' \
// --data '{
//   "price_amount": 3999.5,
//   "price_currency": "usd",
//   "pay_currency": "btc",
//   "ipn_callback_url": "https://nowpayments.io",
//   "order_id": "RGDBP-21314",
//   "order_description": "Apple Macbook Pro 2019 x 1"
// }'




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
       }
        ).then(async response =>  {return await response.data}).catch(error =>  error)
        
      
     
      
     
     
          
     
     }









 
}

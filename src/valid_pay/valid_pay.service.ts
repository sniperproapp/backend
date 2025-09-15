import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
 
import { InjectRepository } from '@nestjs/typeorm';
import {   Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
 
 
 
 


 
@Injectable()
export class valid_payService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>
    ){}

    async findAll(id:number){
     
        return  console.log(id)  ;
    }
    
      
       
     
       
    

   

    
 

     




     async update( data: any  ){
      console.log("payment_id")    
     console.log(data.payment_id)  
     console.log("paymentstatus")  
     console.log(data.payment_status)  
     
     
   
 
        return   console.log(data);
      }

     
     
      



 

  
 


 
}

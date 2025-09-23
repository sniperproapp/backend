import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto{
 
    name?: string;

    
    lastname?: string;
    wallet: string;
     
    phone?: string;
    password?: string;
    
    notification_token?: string;
    imagen?: string;
}
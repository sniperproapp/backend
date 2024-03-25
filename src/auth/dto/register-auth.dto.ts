import { IsEmail, IsNotEmpty, IsString, MinLength, minLength } from "class-validator";

export class RegisterauthDto{
   
    @IsNotEmpty()
    @IsString()
    name:string;

    descargo:number;

    @IsNotEmpty()
    @IsString()
    lastname:string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    phone:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message:'debe tener al menos 6 caracteres'})
    password:string;


    rolesIds: string[];
    
}
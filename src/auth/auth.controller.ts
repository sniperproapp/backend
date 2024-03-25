import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterauthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
    constructor( private authServices: AuthService){

    }

    @Post('register')
    create(@Body() user: RegisterauthDto){
        return this.authServices.register(user);

    }
    
    @Post('login')
    login(@Body() Logindata: LoginAuthDto){
        return this.authServices.login(Logindata);

    }

    @Post('recuperarpass/:email')
    recuperarpass(@Param('email') email:string,){
        return this.authServices.recuperarpass(email);

    }
    
    
    @Post('updatepass')
    updatepass(@Body() Logindata: LoginAuthDto){
        return this.authServices.updatepass(Logindata);

    }

    @Post('logout/:email')
    logout(@Param('email') email:string,){
        return this.authServices.logout(email);

    }
}

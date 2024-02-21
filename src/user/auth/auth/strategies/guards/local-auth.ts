import { Body, Post, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../../auth.service";



export class LocalAuthGuard extends AuthGuard('local'){

constructor(private authService:AuthService){}

    @Post('login')
    async login(@Request() req)   {
        return await this.authService.login(req.user);
    }

    @Post('register')
    async registerUser(@Body()createUserDto:cre)
}
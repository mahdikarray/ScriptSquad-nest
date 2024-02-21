import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService:UserService,
        private jwtService:JwtService){}
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }


    async login(user: any) {
        const payload = { 
            username: user.username,
            sub:user._id
        };
        return {
            ...user,
            access_token: this.jwtService.sign(payload),
        };
    }
}

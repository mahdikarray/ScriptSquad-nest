import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/strategies/local-strategy';

@Module({
    providers:[AuthService,UserService,JwtService,LocalStrategy],
  controllers: [AuthController],
  imports:[JwtModule.register({
    secret:'leao17',//process.env.Jwt_secret,
    signOptions:{expiresIn:'3600s'},
  })]
})
export class AuthModule {}

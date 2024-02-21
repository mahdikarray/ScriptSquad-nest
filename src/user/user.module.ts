import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { MailerService } from 'src/mailer-service/mailer-service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'Leao17', 
      signOptions: { expiresIn: '1h' }, 
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService,MailerService],
})
export class UserModule {}

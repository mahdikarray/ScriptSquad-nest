import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { MailerService } from 'src/mailer-service/mailer-service';




@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) 
        private userModel: mongoose.Model<User> ,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService
        
    ) {}
    
    async findAll(): Promise<User[]> {
        const users = await this.userModel.find().exec();
        return users;
      }

    async findByUsername(username: string): Promise<User | null> {
        return this.userModel.findOne({ username }).exec();
    }

  
    async register(username: string, password: string, email: string): Promise<{ user: User | null; message: string }> {
      try {
        const existingUsername = await this.userModel.findOne({ username }).exec();
        if (existingUsername) {
          return { user: null, message: 'Username already exists' };
        }
    
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
          return { user: null, message: 'Email already exists' };
        }
    
        const confirmationCode = Math.random().toString(36).substring(7);
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = new this.userModel({ username, password: hashedPassword, email });
        await createdUser.save();
    
        await this.sendUserConfirmation(createdUser, confirmationCode);
    
        return { user: createdUser, message: 'User registered successfully' };
      } catch (error) {
        console.error('Error registering user:', error);
        return { user: null, message: 'An error occurred while registering user' };
      }
    }
    
    async sendUserConfirmation(user: User, confirmationCode: string): Promise<void> {
      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Welcome to Nice App! Confirm your Email',
          text: `Hello ${user.username}, please confirm your email with the following code: ${confirmationCode}`,
        });
        console.log('Confirmation email sent successfully');
      } catch (error) {
        console.error('Error sending confirmation email:', error);
        if (error.code === 'ESOCKET' && error.errno === 'ECONNREFUSED') {
          console.error('Connection to SMTP server was refused. Check your SMTP server configuration.');
        }
        throw new Error('Failed to send confirmation email');
      }
    }
    
   

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ username }).exec();
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user.toJSON(); 
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }


    async verifyToken(token: string): Promise<any> {
        try {
          const decodedToken = this.jwtService.verify(token, {
            secret: 'Leao17', // Clé secrète utilisée pour signer le token
            clockTolerance: 10, // Tolérance pour l'horloge (en secondes), utile si les horloges du serveur et du client sont légèrement désynchronisées
            ignoreExpiration: false, // Si true, ne lève pas d'erreur si le token a expiré
          });
          return decodedToken; // Retourne les données du token décodé
        } catch (error) {
          throw new UnauthorizedException('Invalid token'); // Le token est invalide
        }
      }

  //     generateAccessToken(username: string): string {
  //       const payload = { username };
  //       return this.jwtService.sign(payload);
  //   }


  //   async refreshToken(refreshToken: string): Promise<any> {
  //     try {
  //         const decodedRefreshToken = this.jwtService.verify(refreshToken, {
  //             secret: 'YourRefreshTokenSecretKey',
  //         });
  
  //         const newAccessToken = this.generateAccessToken(decodedRefreshToken.username);
  //         return { access_token: newAccessToken };
  //     } catch (error) {
  //         throw new UnauthorizedException('Invalid refresh token');
  //     }
  // }


  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: 'YourRefreshTokenSecretKey',
      });

      // Générer un nouveau access token à partir du username du refresh token
      const newAccessToken = this.generateAccessToken(decodedRefreshToken.username);
      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  generateAccessToken(username: string): string {
    const payload = { username };
    return this.jwtService.sign(payload);
  }
  
  
}

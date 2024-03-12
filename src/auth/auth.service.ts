/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  HttpStatus,
  Res,
  Get,
  Param,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';
import { Tokens } from './../types';
import { AuthDto } from './dto/auth.dto';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { AuthImageDto } from './dto/AuthImageDto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as multer from 'multer';
// import { Multer } from 'multer';
import { Stream } from 'stream';
import * as BufferList from 'bl';

import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Login
//   async login(dto: AuthDto): Promise<Tokens> {
//     const user: any = await this.userService.findUserByEmail(dto.email);

//     if (!user) throw new ForbiddenException('Access Denied.');

//     if (!user.isVerify) throw new ForbiddenException('Account not verified.');

//     const passwordMatches = await bcrypt.compare(dto.password, user.password);

//     if (!passwordMatches) throw new ForbiddenException('Access Denied.');

    

//     const tokens = await this.getTokens(user); 
// //  Verify the user's token
//  const verified = speakeasy.totp.verify({
//   secret: user.twoFactorSecret,
//   encoding: 'base32',
//   token: dto.token, 
//   window: 1
// });
// if (!verified)throw new UnauthorizedException('Invalid token.'); 
//     const rtHash = await this.hashPassword(tokens.refresh_token);

//     await this.userService.updateOne(user._id, { hashdRt: rtHash });

//     return tokens;
// }

// **************************

async login(dto: AuthDto, token: string): Promise<Tokens> {
  const user: any = await this.userService.findUserByEmail(dto.email);

  if (!user) throw new ForbiddenException('Access Denied.');

  if (!user.isVerify) throw new ForbiddenException('Account not verified.');

  const passwordMatches = await bcrypt.compare(dto.password, user.password);

  if (!passwordMatches) throw new ForbiddenException('Access Denied.');

  // Vérifiez si l'authentification à deux facteurs est activée pour l'utilisateur
  if (user.twoFactorSecret) {
      // Vérifiez le token fourni par l'utilisateur avec le secret pour l'authentification à deux facteurs
      const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: token,
          window: 1
      });
      if (!verified) throw new UnauthorizedException('Invalid token.');
  }

  const tokens = await this.getTokens(user);

  const rtHash = await this.hashPassword(tokens.refresh_token);

  await this.userService.updateOne(user._id, { hashdRt: rtHash });

  return tokens;
}

// **************************


  // Logout
  async logout(userId: string) {
    await this.userService.updateOne(userId, { hashdRt: null });
  }

  // Refresh tokens
  async refreshTokens(userId: string, rt: string) {
    const user = await this.userService.findById(userId);

    if (!user || !user.hashdRt) {
      throw new ForbiddenException('Access Denied.');
    }

    const rtMatches = await bcrypt.compare(rt, user.hashdRt);

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied.');
    }

    const tokens = await this.getTokens(user);
    const rtHash = await this.hashPassword(tokens.refresh_token);
    await this.userService.updateOne(user._id, { hashdRt: rtHash });

    return tokens;
  }

  

  async sendMailtoStudent(email: string, fullname: string): Promise<void> {
    const secretKey = 'qsdsqdqdssqds';
    const token = this.jwtService.sign(
      { email },
      { secret: secretKey, expiresIn: '1d' },
    );

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'contact.fithealth23@gmail.com',
        pass: 'ebrh bilu ygsn zrkw',
      },
    });

    const msg = {
      from: {
        name: 'Active your account',
        address: 'contact.fithealth23@gmail.com',
      },
      to: email,
      subject: ' Account Confirmation',
      // html: `<b><b>HI ${fullname} ? <a href="http://localhost:3046/auth/activate/${token}">Activate Your Account</a></b>`,
      html: `<b><b>HI ${fullname} ? <a href="http://localhost:3000/authentication/activation/${token}">Activate Your Account</a></b>`
    };
    
    try {
      await transporter.sendMail(msg);
      console.log('Email has been sent!');
    } catch (error) {
      console.error(error);
    }
  }
  
  // Register user

  // async register(dto: AuthDto): Promise<Tokens> {
  //   const existingUser = await this.userService.findUserByEmail(dto.email);
  //   if (existingUser) {
  //     // Handle the case where the email already exists, e.g., throw an exception
  //     throw new ForbiddenException('Email address is already registered.');
  //   }
  //   const user: any = await this.userService.create(dto);

  //   const tokens = await this.getTokens(user);

  //   const rtHash = await this.hashPassword(tokens.refresh_token);

  //   await this.userService.updateOne(user._id, { hashdRt: rtHash });
  //   await this.sendMailtoStudent(dto.email, dto.full_name);
  //   return tokens;
  // }
 
  // **********************************************************************
  // async register(dto: AuthDto): Promise<string> {
  //   const existingUser = await this.userService.findUserByEmail(dto.email);
  //   if (existingUser) {
  //     throw new ForbiddenException('Email address is already registered.');
  //   }
  
  //   // Générer une clé secrète pour l'utilisateur
  //   const secret = speakeasy.generateSecret({ length: 20 });
  
  //   // Créer l'utilisateur avec la clé secrète
  //   const user: any = await this.userService.create({
  //     email: dto.email,
  //     password: dto.password,
  //     full_name: dto.full_name,
  //     isVerify: dto.isVerify,
  //     twoFactorSecret: secret.base32 ,// Ajouter la clé secrète à l'utilisateur
  //     qrCodeDataUrl:qrCodeDataUrl
  //   });
  
  //   // Générer le code QR pour l'authentification 2FA
  //   const otpauthUrl = speakeasy.otpauthURL({
  //     secret: secret.ascii,
  //     label: 'MyApp',
  //     issuer: 'MyApp'
  //   });
  
  //   // Générer le code QR sous forme de données d'URL
  //    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl).catch((error) => {
  //     console.error('Error generating QR code:', error);
  //     throw new InternalServerErrorException('Failed to generate QR code.');
  //   });
  
  //   // Envoyer le code QR à l'utilisateur
  //   await this.sendQRCodeToUser(dto.email, qrCodeDataUrl).catch((error) => {
  //     console.error('Error sending QR code email:', error);
  //     throw new InternalServerErrorException('Failed to send QR code email.');
  //   });
  
  //   // Créer les tokens pour l'utilisateur
  //   const tokens = await this.getTokens(user);
  
  //   // Hasher le token de rafraîchissement pour stockage
  //   const rtHash = await this.hashPassword(tokens.refresh_token);
  
  //   // Mettre à jour l'utilisateur avec le hash du token de rafraîchissement
  //   await this.userService.updateOne(user._id, { hashdRt: rtHash });
  
  //   // Envoyer un e-mail de confirmation à l'utilisateur
  //   await this.sendMailtoStudent(dto.email, dto.full_name);
  
  //   return  qrCodeDataUrl;
  // }

  // **********************************************************

  async register(dto: AuthDto): Promise<string> {
    const existingUser = await this.userService.findUserByEmail(dto.email);
    if (existingUser) {
        throw new ForbiddenException('Email address is already registered.');
    }

    // Générer une clé secrète pour l'utilisateur
    const secret = speakeasy.generateSecret({ length: 20 });

    // Générer le code QR pour l'authentification 2FA
    const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: 'MyApp',
        issuer: 'MyApp'
    });

    // Générer le code QR sous forme de données d'URL
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl).catch((error) => {
        console.error('Error generating QR code:', error);
        throw new InternalServerErrorException('Failed to generate QR code.');
    });

    // Envoyer le code QR à l'utilisateur
    await this.sendQRCodeToUser(dto.email, qrCodeDataUrl).catch((error) => {
        console.error('Error sending QR code email:', error);
        throw new InternalServerErrorException('Failed to send QR code email.');
    });

    // Créer l'utilisateur avec la clé secrète, l'URL du code QR et d'autres informations
    const user: any = await this.userService.create({
        email: dto.email,
        password: dto.password,
        full_name: dto.full_name,
        isVerify: dto.isVerify,
        twoFactorSecret: secret.base32, // Ajouter la clé secrète à l'utilisateur
        qrCodeDataUrl: qrCodeDataUrl // Enregistrer l'URL du code QR dans la base de données
    });

    // Créer les tokens pour l'utilisateur
    const tokens = await this.getTokens(user);

    // Hasher le token de rafraîchissement pour stockage
    const rtHash = await this.hashPassword(tokens.refresh_token);

    // Mettre à jour l'utilisateur avec le hash du token de rafraîchissement
    await this.userService.updateOne(user._id, { hashdRt: rtHash });

    // Envoyer un e-mail de confirmation à l'utilisateur
    await this.sendMailtoStudent(dto.email, dto.full_name);

    // Retourner l'URL du code QR
    return qrCodeDataUrl;
}

  // **********************************************************
  
  async sendQRCodeToUser(email: string, qrCodeDataUrl: string): Promise<void> {
    // Configurer le service de messagerie (vous pouvez utiliser Nodemailer ou tout autre service de messagerie de votre choix)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'contact.fithealth23@gmail.com',
        pass: 'ebrh bilu ygsn zrkw',
      },
    });
  
    // Définir le contenu du message
    const msg = {
      from: {
        name: 'MyApp',
        address: 'contact.fithealth23@gmail.com',
      },
      to: email,
      subject: 'QR Code for Two-Factor Authentication',
      html: `
      <p>Dear User,</p>
      <p>Please scan the following QR code with your authenticator app to enable Two-Factor Authentication:</p>
      <img src="${qrCodeDataUrl}" alt="QR Code"/>
    `,
    };
  
    // Envoyer l'e-mail
    await transporter.sendMail(msg).catch((error) => {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email.');
    });
  
    console.log('Email with QR code has been sent to the user.');
  }
  
  
  // **********************************************************************

 

  async getProfile(id: string) {
    const user = await this.userService.findById(id);

    if (user) {
      user.password = null;
      user.hashdRt = null;
    }

    return user;
  }

  // Generate access and refresh tokens
  async getTokens(user: any): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
          ROLE: user.role,
          username:user.full_name,
          password:user.password,
        },
        {
          secret: process.env.ACCESS_TOKEN_SECRET || 'at-secret',
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
          username:user.full_name,
          password:user.password,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET || 'rt-secret',
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  // Encrypt password
  async hashPassword(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }



  // ***************************

  async validateUserPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return bcrypt.compare(password, user.password);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hasher le nouveau mot de passe
    await this.userService.updatePassword(userId, hashedPassword);
  }

  async forgetPassword(email: string): Promise<void> {
    console.log("Received request to reset password:", email);
    const secretKey = process.env.EMAIL_SECRET_KEY || 'qsdsqdqdssqds';
    const token = this.jwtService.sign({ email }, { secret: secretKey, expiresIn: '24h' });

    
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'contact.fithealth23@gmail.com',
        pass: 'ebrh bilu ygsn zrkw',
      },
    });

    const msg = {
      from: {
        name: 'Active your account',
        address: 'contact.fithealth23@gmail.com',
      },
      to: email,
      subject: 'Reset Password',
      html: `<b>Hello World, <a href="http://localhost:3000/authentication/receive-token/${token}">Reset password</a></b>`,
    };

    const sendMail = async (transporter: any, msg: any) => {
      try {
        await transporter.sendMail(msg);
        // res.send("Email has been sent !");
        console.log("Email has been sent !");
      } catch (error) {
        console.error(error);
      }
    };
    sendMail(transporter, msg);
  }

  // async uploadImage(req: any, file: Express.Multer.File): Promise<any> { 
  //   if (!file) {
  //     throw new BadRequestException('No image uploaded.');
  //   }
  
  //   // Définir les options de stockage
  //   const storage = diskStorage({
  //     destination: (req, file, cb) => {
  //       cb(null, './dto/uploads'); // Répertoire où les fichiers seront téléchargés
  //     },
  //     filename: (req, file, cb) => {
  //       const randomName = Array(32)
  //         .fill(null)
  //         .map(() => Math.round(Math.random() * 16).toString(16))
  //         .join('');
  //       cb(null, `${randomName}${extname(file.originalname)}`);
  //     },
  //   });
  
  //   // Télécharger le fichier
  //   const upload = multer({ storage }).single('image');
  //   return new Promise((resolve, reject) => {
  //     upload(req, null, async (err) => { // Utilisez `req` et `null` comme arguments
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve({
  //         url: file.path, // Supposant que le chemin où le fichier est stocké est son URL
  //         filename: file.filename,
  //       });
  //     });
  //   });
  // }

  // ****************************************
//   async register(dto: AuthDto, file: Express.Multer.File): Promise<Tokens> {
//     const existingUser = await this.userService.findUserByEmail(dto.email);
//     if (existingUser) {
//       throw new ForbiddenException('Email address is already registered.');
//     }

//     // Ajouter l'image téléchargée lors de l'enregistrement de l'utilisateur
//     const imageInfo = await this.uploadImage(null, file);

//     // Ajouter le chemin de l'image à la DTO avant de créer l'utilisateur
//     dto.imagePath = imageInfo.url;

//     const user: any = await this.userService.create(dto);

//     const tokens = await this.getTokens(user);

//     const rtHash = await this.hashPassword(tokens.refresh_token);

//     await this.userService.updateOne(user._id, { hashdRt: rtHash });
//     await this.sendMailtoStudent(dto.email, dto.full_name);
//     return tokens;
// }


  // ****************************************

  // // Méthode pour inscrire un utilisateur
  // async register(dto: AuthDto, imageDto: AuthImageDto): Promise<Tokens> {
  //   const existingUser = await this.userService.findUserByEmail(dto.email);
  //   if (existingUser) {
  //     throw new ForbiddenException('Email address is already registered.');
  //   }
  
  //   const userImage = await this.uploadImage(null, imageDto.file); // Passer `null` pour `req` car il n'est pas utilisé dans la méthode `uploadImage`
  //   dto.image = userImage.url; // Supposant que vous avez une URL pour l'image téléchargée
  
  //   const user: any = await this.userService.create(dto);
  
  //   const tokens = await this.getTokens(user);
  
  //   const rtHash = await this.hashPassword(tokens.refresh_token);
  
  //   await this.userService.updateOne(user._id, { hashdRt: rtHash });
  //   await this.sendMailtoStudent(dto.email, dto.full_name);
  //   return tokens;
  // }



  // *******************************************************************

  // async saveFileToDatabase(file: Express.Multer.File, userEmail: string) {
  //   // Créer un buffer à partir du fichier en mémoire
  //   const bufferStream = new Stream.PassThrough();
  //   bufferStream.end(file.buffer);
  
  //   // Convertir le bufferStream en Buffer
  //   const bl = new BufferList();
  //   await new Promise((resolve, reject) => {
  //     bufferStream.pipe(bl).on('finish', resolve).on('error', reject);
  //   });
  //   const bufferData = bl.slice();
  
  //   // Créer un nouveau document avec les données du fichier converties en Buffer
  //   const newDocument = new this.AuthDto({
  //     image: file.originalname,
    
  //     data: bufferData, // Utiliser le Buffer converti
  //     userEmail: userEmail,
      
  //   });
  
  //   // Enregistrer le document dans la base de données
  //   const savedDocument = await newDocument.save();
  
  //   // Retourner l'ID du document enregistré
  //   return savedDocument._id;
  // }


  // *************reset password*****************************

  // async resetPassword(token: string, newPassword: string): Promise<boolean> {
  //   try {
  //     // Decode the token to extract the email address
  //     const decodedToken = this.jwtService.verify(token);

  //     // Check if the token is valid and not expired
  //     if (!decodedToken || !decodedToken.email) {
  //       throw new Error('Invalid or expired token');
  //     }

  //     // Assuming you have a method to fetch user by email from database
  //     const user = await this.userService.findUserByEmail(decodedToken.email);

  //     // Hash the new password
  //     const hashedPassword = await bcrypt.hash(newPassword, 10);

  //     // Update the user's password in the database
  //     await this.userService.updatePassword(user.email, hashedPassword);

  //     return true;
  //   } catch (error) {
  //     console.error('Error resetting password:', error);
  //     return false;
  //   }
  // }

  // *******************************************************************

 }

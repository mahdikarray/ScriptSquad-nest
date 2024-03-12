/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DataBaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { ConfigModule } from '@nestjs/config';


import { RolesModule } from './roles/roles.module';
import { AuthController } from './auth/auth.controller';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DataBaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    AuthModule,
    // MulterModule.register({
    //   dest: './documentFiles', // Dossier de destination des fichiers uploadés
    // }),
  ],
  providers: [ 
    // {
    //   // provide: APP_GUARD,
    //   // useClass: AtGuard,
     
    // },
  ],
})
export class AppModule {}

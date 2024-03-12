import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { MulterModule } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

   // app.use(
  //   MulterModule.register({
  //     dest: './documentFiles', // Dossier de destination des fichiers uploadés
  //   }).module,
  // );

  // app.setGlobalPrefix('v1');

  app.use(helmet());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT);
}
bootstrap();

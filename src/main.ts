import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsMiddleware } from './cors.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(new CorsMiddleware().use);
  
  await app.listen(3000);

  app.use(
    MulterModule.register({
      dest: './documentFiles', // Dossier de destination des fichiers uploadés
    }).module,
  );
}
bootstrap();

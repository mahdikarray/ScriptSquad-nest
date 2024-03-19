import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsModule } from './Document/documents.module';
import { CorsMiddleware } from './cors.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { EventsModule } from './Events/events.module';
import { FilesModule } from './ImportFiles/files.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'),
    DocumentsModule,
    EventsModule,
    FilesModule,
    MulterModule.register({
      dest: './documentFiles', // Dossier de destination des fichiers uploadés
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
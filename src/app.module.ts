// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EditorModule } from './editor/editor.module';
import { DocumentsModule } from './Document/documents.module';
import { TaskModule } from './Task/Task.module';
import { ChatGateway } from './chat/chat.gateway';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest?directConnection=true'),
    EditorModule,
    DocumentsModule,
    TaskModule,
    MulterModule.register({
      dest: './uploads', // Save uploaded files to the ./uploads directory
    }),

  ],
  providers: [ChatGateway],
})
export class AppModule {}

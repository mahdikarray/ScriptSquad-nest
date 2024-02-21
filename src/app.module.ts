// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EditorModule } from './editor/editor.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { DocumentsModule } from './Document/documents.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest?directConnection=true'),
    EditorModule,
    WorkspaceModule,
    DocumentsModule,

    
  ],
})
export class AppModule {}

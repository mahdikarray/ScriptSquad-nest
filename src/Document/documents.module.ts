import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentService } from './documents.service';
import { Document, DocumentSchema } from './Schemas/Document.schemas';
import { EditorModule } from 'src/editor/editor.module'; // Import the EditorModule

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Document.name,
        schema: DocumentSchema,
      },
    ]),
    EditorModule, // Import the EditorModule
  ],
  providers: [DocumentService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}

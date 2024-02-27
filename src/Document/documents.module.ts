import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentController } from './documents.controller';
import { DocumentService } from './documents.service';
import { Document, DocumentSchema } from './Schemas/Document.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Document.name,
        schema: DocumentSchema,
      },
    ]),
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentsModule {}
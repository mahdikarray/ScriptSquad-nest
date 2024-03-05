import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDocumentDto } from './dto/CreateDocument.dto';
import { UpdateDocumentDto } from './dto/UpdateDocument.dto';
import { Document } from './Schemas/Document.schemas';
import { EditorService } from '../editor/editor.service'; // Import the EditorService
import { Multer } from 'multer';
@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<Document>,
    private readonly editorService: EditorService, // Inject the EditorService
  ) {}

  async createDocument(createDocumentDto: CreateDocumentDto) {
    // Create a new document
    const newDocument = new this.documentModel(createDocumentDto);
    const savedDocument = await newDocument.save();

    // Create an editor for the document
    await this.editorService.createPost(savedDocument.title, savedDocument._id,Multer.File); // Assuming title is used for editor title

    return savedDocument;
  }

  getDocuments() {
    return this.documentModel.find();
  }

  async getDocumentById(id: string) {
    return this.documentModel.findById(id);
  }

  async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto) {
    return this.documentModel.findByIdAndUpdate(id, updateDocumentDto, {
      new: true,
    });
  }

  async deleteDocumentById(id: string) {
    return this.documentModel.findByIdAndDelete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDocumentDto } from './dto/CreateDocument.dto';
import { UpdateDocumentDto } from './dto/UpdateDocument.dto';
import { Document } from './Schemas/Document.schemas';

@Injectable()
export class DocumentService {

  constructor(
    @InjectModel(Document.name) private documentModel: Model<Document>,
  ) {}

  createDocument(createDocumentDto: CreateDocumentDto) {
    const newDocument = new this.documentModel(createDocumentDto);
    return newDocument.save();
  }

  getDocuments(){
    return this.documentModel.find();
  }

  getDocumentById(id: string){
    return this.documentModel.findById(id);
  }

  updateDocument(id: string, updateDocumentDto: UpdateDocumentDto){
    return this.documentModel.findByIdAndUpdate(id, updateDocumentDto, {
      new: true,
    });
  }


  deleteDocumentById(id: string){
    return this.documentModel.findByIdAndDelete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDocumentDto } from './dto/createDocument.dto';
import { UpdateDocumentDto } from './dto/updateDocument.dto';
import { Document, DocumentVersion } from './Schemas/Document.schemas';
import * as nodemailer from 'nodemailer';
import { Multer } from 'multer';
import { Stream } from 'stream';
import * as BufferList from 'bl';
import { EditorService } from 'src/editor/editor.service';

@Injectable()
export class DocumentService {

  private transporter;

  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>, private readonly editorService: EditorService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fayrouz.hidouri@esprit.tn',
        pass: '201JFT2638',
      },
    });
  }

  async sendEmail(userEmail: string, documentName: string, documentId: Types.ObjectId) {
    const documentLink = this.generateDocumentLink(documentId.toString());

    const mailOptions = {
      from: 'fayrouz.hidouri@esprit.tn',
      to: userEmail,
      subject: 'Document Créé avec Succès',
      text: `Monsieur/Madame,\n\nVotre document "${documentName}" a été créé avec succès.\n\nVous pouvez consulter votre document ici : ${documentLink}\n\nCordialement,\nVotre Application`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  generateDocumentLink(documentId: string): string {
    const frontendUrl = 'http://localhost:3001';
    return `${frontendUrl}/documents/getById/${documentId}`;
  }

  async createDocument(createDocumentDto: CreateDocumentDto) {
    const newDocument = new this.documentModel(createDocumentDto);

    if (createDocumentDto.note) {
      newDocument.note = createDocumentDto.note;
    }

    const savedDocument = await newDocument.save();
    const documentId = savedDocument._id;

    // Create editor here
    const newEditor = await this.editorService.createPost(createDocumentDto.title, createDocumentDto.name);
    // Associate editor with the document
    savedDocument.post = newEditor._id;
    await savedDocument.save();

    await this.sendEmail(
      createDocumentDto.userEmail,
      createDocumentDto.name,
      documentId,
    );

    return savedDocument;
}


  async getDocuments() {
    return this.documentModel.find();
  }

  async getDocumentById(id: string) {
    return this.documentModel.findById(id);
  }

  async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto) {
    const existingDocument = await this.documentModel.findById(id);
  
    if (!existingDocument) {
      throw new Error('Document not found');
    }
  
    const newVersion: DocumentVersion = {
      versionNumber: existingDocument.versionHistory.length + 1,
      name: existingDocument.name,
      title: existingDocument.title,
      createdAt: existingDocument.updatedAt,
      note: existingDocument.note,
    };
  
    existingDocument.versionHistory.push(newVersion);
  
    if (updateDocumentDto.name) {
      existingDocument.name = updateDocumentDto.name;
    }
  
    if (updateDocumentDto.title) {
      existingDocument.title = updateDocumentDto.title;
    }
  
    if (updateDocumentDto.note) {
      existingDocument.note = updateDocumentDto.note;
    }
  
    existingDocument.updatedAt = new Date();
  
    const savedDocument = await existingDocument.save();
  
    return savedDocument;
  }
  
  
  async deleteDocumentById(id: string) {
    return this.documentModel.findByIdAndDelete(id);
  }

  formatDate(date: Date): Date {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return new Date(year, month - 1, day, hours, minutes);
  }
  
  

  async getFileContent(id: string): Promise<Buffer> {
    const document = await this.documentModel.findById(id);

    if (!document) {
      throw new Error('Document not found');
    }

    return document.data;
  }
  
}

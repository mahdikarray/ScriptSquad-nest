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

@Injectable()
export class DocumentService {

  private transporter;

  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
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
  
  async saveFileToDatabase(file: Express.Multer.File, userEmail: string, title: string) {
    // Créer un buffer à partir du fichier en mémoire
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(file.buffer);
  
    // Convertir le bufferStream en Buffer
    const bl = new BufferList();
    await new Promise((resolve, reject) => {
      bufferStream.pipe(bl).on('finish', resolve).on('error', reject);
    });
    const bufferData = bl.slice();
  
    // Créer un nouveau document avec les données du fichier converties en Buffer
    const newDocument = new this.documentModel({
      name: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      data: bufferData, // Utiliser le Buffer converti
      userEmail: userEmail,
      title: title,
    });
  
    // Enregistrer le document dans la base de données
    const savedDocument = await newDocument.save();
  
    // Retourner l'ID du document enregistré
    return savedDocument._id;
  }

  async getFileContent(id: string): Promise<Buffer> {
    const document = await this.documentModel.findById(id);

    if (!document) {
      throw new Error('Document not found');
    }

    return document.data;
  }
  
}

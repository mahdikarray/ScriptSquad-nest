import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDocumentDto } from './dto/createDocument.dto';
import { UpdateDocumentDto } from './dto/updateDocument.dto';
import { Document, DocumentVersion } from './Schemas/Document.schemas';
import * as nodemailer from 'nodemailer';

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

  async sendEmail(userEmail: string, documentName: string) {
    const mailOptions = {
      from: 'fayrouz.hidouri@esprit.tn',
      to: userEmail,
      subject: 'Document Créé avec Succès',
      text: `Monsieur/Madame,\n\nVotre document "${documentName}" a été créé avec succès.\n\nCordialement,\nVotre Application`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async createDocument(createDocumentDto: CreateDocumentDto) {
    const newDocument = new this.documentModel(createDocumentDto);
    
    // Sauvegarder le nouveau document
    const savedDocument = await newDocument.save();
    
    // Envoyer un email à l'utilisateur
    await this.sendEmail(createDocumentDto.userEmail, createDocumentDto.name);

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
  
    // Créer une nouvelle version
    const newVersion: DocumentVersion = {
      versionNumber: existingDocument.versionHistory.length + 1,
      name: existingDocument.name,  // Utiliser le nom existant pour conserver l'historique
      title: existingDocument.title, // Utiliser le titre existant pour conserver l'historique
      state: existingDocument.state, // Utiliser l'état existant pour conserver l'historique
      createdAt:  new Date(), // Utiliser la date de la dernière mise à jour comme date de création
      updatedAt: new Date(),
    };
  
    // Ajouter la nouvelle version à l'historique des versions du document
    existingDocument.versionHistory.push(newVersion);
  
    // Mettre à jour les autres champs du document avec les nouvelles valeurs
    existingDocument.name = updateDocumentDto.name;
    existingDocument.title = updateDocumentDto.title;
    existingDocument.state = updateDocumentDto.state;
    
    // Sauvegarder le document mis à jour avec la nouvelle version
    const updatedDocument = await existingDocument.save();
  
    // Retourner le document mis à jour
    return updatedDocument;
  }
  
  async deleteDocumentById(id: string) {
    return this.documentModel.findByIdAndDelete(id);
  }
}

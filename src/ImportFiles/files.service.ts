import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb'; // Utilisez ObjectId de mongodb
import { FileImport } from './file.schemas';
import { Multer } from 'multer';
import { Stream } from 'stream';
import * as BufferList from 'bl';

@Injectable()
export class FilesService {
  constructor(@InjectModel(FileImport.name) private FileModel: Model<FileImport>) {}

  async saveFileToDatabase(file: Express.Multer.File) {
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
    const newFile = new this.FileModel({
      name: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      data: bufferData, // Utiliser le Buffer converti
    });
  
    // Enregistrer le document dans la base de données
    const savedFile = await newFile.save();
  
    // Retourner l'ID du document enregistré
    return savedFile._id;
  }

  async getFileContent(id: string): Promise<Buffer> {
    const file = await this.FileModel.findById(id);

    if (!file) {
      throw new Error('File not found');
    }

    return file.data;
  }

  async getFiles() {
    return this.FileModel.find();
  }

  async getFileById(id: string) {
    return this.FileModel.findById(id);
  }

  async deleteFileById(id: string) {
    return this.FileModel.findByIdAndDelete(id);
  }

}
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { DocumentService } from './documents.service';
import { CreateDocumentDto } from './dto/CreateDocument.dto';
import { UpdateDocumentDto } from './dto/UpdateDocument.dto';

@Controller('Documents')
export class DocumentsController{
  constructor(private documentService: DocumentService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  createDocument(@Body() createDocumentDto: CreateDocumentDto ) {
    return this.documentService.createDocument(createDocumentDto);
  }

  @Get()
  getDocuments(){
    return this.documentService.getDocuments();
  }

  @Get(':id')
  async getDocumentById(@Param('id') id: string){
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Document not found', 404);
    const findDocument = await this.documentService.getDocumentById(id);
    if (!findDocument) throw new HttpException('Document not found', 404);
    return findDocument;
  }

  @Patch(':id')
  async updateDocument(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    const updateDocument = await this.documentService.updateDocument(
      id,
      updateDocumentDto,
    );
    if (!updateDocument) throw new HttpException('Document Not Found', 404);
    return updateDocument;
  }


  @Delete(':id')
  async deleteDocument(@Param('id') id: string){
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    const deleteDocument = await this.documentService.deleteDocumentById(id);
    if (!deleteDocument) throw new HttpException('Document Not Found', 404);
    return;

  }
}
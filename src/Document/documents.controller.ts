import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/createDocument.dto';
import { UpdateDocumentDto } from './dto/updateDocument.dto';
import { DocumentService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Response } from 'express';
import { Multer } from 'multer';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    const newDocument = await this.documentService.createDocument(createDocumentDto);

    return newDocument;
  }
  
  @Get('getAll')
  async findAll() {
    return this.documentService.getDocuments();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string) {
    return this.documentService.getDocumentById(id);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentService.updateDocument(id, updateDocumentDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.documentService.deleteDocumentById(id);
  }

  @Post('uploadFile')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@Res() res: Response, @UploadedFile() file: Multer.File, @Body() body: any) {
  // Assurez-vous d'avoir les données nécessaires, telles que userEmail et title
  const userEmail = body.userEmail;
  const title = body.title;

  const savedFileId = await this.documentService.saveFileToDatabase(file, userEmail, title);
  
  return res.status(HttpStatus.OK).json({
    success: true,
    fileId: savedFileId,
  });
}


@Get('download/:id')
async downloadFile(@Param('id') id: string, @Res() res: Response) {
  const fileContent = await this.documentService.getFileContent(id);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow');
  res.setHeader('Content-Disposition', 'attachment; filename=document.pptx');

  res.send(fileContent);
}

}

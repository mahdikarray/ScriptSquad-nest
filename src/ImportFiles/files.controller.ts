import { Controller, Get, Post, Body, Delete, Param, Put, UseInterceptors, Res, UploadedFile,HttpStatus,
    HttpException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Response } from 'express';


@Controller('ImportFile')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get('download/:id')
async downloadFile(@Param('id') id: string, @Res() res: Response) {
  const fileContent = await this.filesService.getFileContent(id);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow');
  res.setHeader('Content-Disposition', 'attachment; filename=document.pptx');

  res.send(fileContent);
}

@Post('uploadFile')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@Res() res, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
  // Assurez-vous d'avoir les données nécessaires, telles que userEmail et title
  const userEmail = body.userEmail;
  const title = body.title;

  const savedFileId = await this.filesService.saveFileToDatabase(file);
  
  return res.status(HttpStatus.OK).json({
    success: true,
    fileId: savedFileId,
  });
}

@Delete('delete/:id')
async remove(@Param('id') id: string) {
  return this.filesService.deleteFileById(id);
}

@Get('getAll')
async findAll() {
  return this.filesService.getFiles();
}

@Get('getById/:id')
async findOne(@Param('id') id: string) {
  return this.filesService.getFileById(id);
}
}

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

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.createDocument(createDocumentDto);
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
  @UseInterceptors(FileInterceptor(
    'file',{
      storage : diskStorage({
        destination :'./src/documentFiles',
        filename: (req, file, callBack) =>{
          const fileName = path.parse(file.originalname).name.replace(/\s/g,'') + Date.now();
          const extension = path.parse(file.originalname).ext;
          callBack(null, `${fileName}${extension}`);
        }
      })
    }
  ))
  uploadFile(@Res() res, @UploadedFile() file){
    return res.status(HttpStatus.OK).json({
      success : true,
      data: file.path
    });
  }
}

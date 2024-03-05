import { Controller, Post, Body, Put, Param, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EditorService } from './editor.service';
import { CreateEditorDto, UpdateEditorDto } from './editor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { MulterFile } from './post.schema';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
@Controller('editor')
export class EditorController {
  constructor(private readonly editorService: EditorService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createEditorDto: CreateEditorDto, @UploadedFile() image: Multer.File) {
    return this.editorService.createPost(createEditorDto.title, createEditorDto.data, image);
  }

  @Get()
  async getAll() {
    return this.editorService.getAllPosts();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.editorService.getPostById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateEditorDto: UpdateEditorDto) {
    return this.editorService.updatePost(id, updateEditorDto.data);
  }
}

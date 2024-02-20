import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { EditorService } from './editor.service';
import { CreateEditorDto, UpdateEditorDto } from './editor.dto';

@Controller('editor')
export class EditorController {
  constructor(private readonly editorService: EditorService) {}

  @Post()
  async create(@Body() createEditorDto: CreateEditorDto) {
    return this.editorService.createPost(createEditorDto.title, createEditorDto.data);
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

import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { Workspace } from 'src/workspace/workspace.schema';
import { WorkspaceDto } from 'src/auth/dto/workspace.dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Body() workspace: WorkspaceDto) {
    return await this.workspaceService.create(workspace);
  }

  @Get()
  async findAll() {
    return await this.workspaceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.workspaceService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() workspace: Workspace) {
    try {
      return await this.workspaceService.update(id, workspace);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.workspaceService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

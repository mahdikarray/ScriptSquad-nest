import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workspace } from 'src/workspace.schema';

@Injectable()
export class WorkspaceService {
    constructor(@InjectModel(Workspace.name) private readonly workspaceModel: Model<Workspace>) {}

    async create(workspace: Workspace): Promise<Workspace> {
        const createdWorkspace = new this.workspaceModel(workspace);
        return await createdWorkspace.save();
      }
    
      async findAll(): Promise<Workspace[]> {
        return await this.workspaceModel.find().exec();
      }
    
      async findOne(id: string): Promise<Workspace> {
        const workspace = await this.workspaceModel.findById(id).exec();
        if (!workspace) {
          throw new NotFoundException(`User with id ${id} not found`);
        }
        return workspace;
      }
    
      async update(id: string, workspace: Workspace): Promise<Workspace> {
        const updatedWorkspace = await this.workspaceModel.findByIdAndUpdate(id, workspace, { new: true }).exec();
        if (!updatedWorkspace) {
          throw new NotFoundException(`User with id ${id} not found`);
        }
        return updatedWorkspace;
      }
    
      async remove(id: string): Promise<Workspace> {
        const deletedWorkspace = await this.workspaceModel.findByIdAndDelete(id).exec();
        if (!deletedWorkspace) {
          throw new NotFoundException(`Workspace not found`);
        }
        return deletedWorkspace;
      }
}

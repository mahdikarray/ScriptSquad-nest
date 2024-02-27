import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workspace } from 'src/workspace/workspace.schema';
import * as bcrypt from 'bcrypt';
import { WorkspaceDto } from 'src/auth/dto/workspace.dto';


@Injectable()
export class WorkspaceService {
    constructor(@InjectModel(Workspace.name) private readonly workspaceModel: Model<Workspace>) {}

    async create(workspace: WorkspaceDto): Promise<Workspace> {
        const createdWorkspace = new this.workspaceModel(workspace);
        return await createdWorkspace.save();
      }
    
      async findAll(): Promise<any[]> {
        try {
          const workspaces = await this.workspaceModel.find().exec();
          const hashedWorkspaces = await Promise.all(workspaces.map(async (workspace) => {
            const hashedCode = await bcrypt.hash(workspace.code, 10);
            return { ...workspace.toObject(), code: hashedCode };
          }));
          return hashedWorkspaces;
        } catch (error) {
          // Handle error
          throw new Error('Error while finding workspaces');
        }
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

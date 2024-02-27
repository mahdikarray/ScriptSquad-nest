import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from '../Task/dto/CreateTask.dto';
import { Task } from './schemas/task.schema';

@Injectable()
export class TaskService {
    constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

    async createTask(createTaskDto: CreateTaskDto) {
        const newTask = new this.taskModel(createTaskDto);
        return newTask.save();
    }

    async getTasks() {
        return this.taskModel.find();
    }

    async getTaskById(id: string) {
        return this.taskModel.findById(id);
    }

    async updateTask(id: string, updateTaskDto: CreateTaskDto) {
        return this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true });
    }

    async deleteTask(id: string) {
        return this.taskModel.findByIdAndDelete(id);
    }
}

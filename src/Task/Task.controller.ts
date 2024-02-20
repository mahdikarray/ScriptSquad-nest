import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/CreateTask.dto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto) {
        return this.taskService.createTask(createTaskDto);
    }

    @Get()
    getTasks() {
        return this.taskService.getTasks();
    }

    @Get(':id')
    getTaskById(@Param('id') id: string) {
        return this.taskService.getTaskById(id);
    }

    @Patch(':id')
    updateTask(@Param('id') id: string, @Body() updateTaskDto: CreateTaskDto) {
        return this.taskService.updateTask(id, updateTaskDto);
    }

    @Delete(':id')
    deleteTask(@Param('id') id: string) {
        return this.taskService.deleteTask(id);
    }
}

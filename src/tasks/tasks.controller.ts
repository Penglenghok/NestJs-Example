import { Body, Controller, Delete, Get, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { json } from 'express';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pips';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    private logger = new Logger('TasksController')
    constructor(private tasksService: TasksService) {
    }

    @Get()
    getTask(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User) {
        this.logger.verbose(`User ${user.username} retrieve all tasks. Filters:${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto, user)
    }

    @Get("/:id")
    getTaskById(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User): Promise<Task> {
            console.log('user', user)
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete("/:id")
    deleteTask(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.tasksService.deleteTask(id, user)
    }

    @Patch("/:id/status")
    updateTaskStatus(@Param("id", ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus, @GetUser() user: User): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user)
    }



}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';


@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository) { }



    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user)
    }
    // private task: Task[] = [];

    // getAllTask(): Task[] {
    //     return this.task
    // }

    // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {

    //     const { status, search } = filterDto;
    //     let tasks = this.getAllTask();
    //     if (status) {
    //         tasks = tasks.filter((tasks: any) => tasks.status == status)
    //     }
    //     if (search) {
    //         tasks = tasks.filter((task: any) =>
    //             task.title.includes(search) ||
    //             task.description.includes(search)
    //         )
    //     }
    //     return tasks;

    // }

    async createTask(createTaskDto: CreateTaskDto, user: User) {

        return this.taskRepository.createTask(createTaskDto, user);

    }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto
    //     const task: Task = {
    //         id: uuidv4(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     }
    //     this.task.push(task);
    //     return task;
    // }


    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`task with ID ${id} not found`);
        }
        return found
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id })
        if (result.affected === 0) {
            throw new NotFoundException(`task with ID ${id} not found`);
        }
    }

    // deleteTask(id: string): void {
    //     const found = this.getTaskById(id);
    //     this.task = this.task.filter(task => task.id !== found.id);
    //     // return this.task
    // }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status
        await task.save()
        return task;
    }



}

import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";



@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {

        const { search, status } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where('task.userId=:userId', { userId: user.id })

        if (status) {
            query.andWhere('task.status=:status', { status })
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` })
        }
        const tasks = await query.getMany()
        return tasks

    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const task = new Task();
        const { title, description } = createTaskDto
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        task.user = user;
        await task.save();
        delete task.user;
        return task;
    }

}
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Task, TaskInput } from "./task.entity";
import { TaskService } from "./task.service";

@Resolver('Post')
export class TaskResolver {
  constructor(private readonly taskService:TaskService) {}

  @Query(() => String)
  sayHelloTask(): string {
    return 'Hello World!';
  }

  @Query(() => [Task])
  async getListTask(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @Mutation(() => Task)
  async createTask(@Args({name:'TaskInput',type: ()=> TaskInput}) task:TaskInput): Promise<Task> {
    let task1 = new Task();
    task1.title = task.title;
    
    return await this.taskService.create(task1);
  }
}
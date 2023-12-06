import { Test, TestingModule } from '@nestjs/testing';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { Task, TaskInput } from './task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


class TaskServiceMock {
    sayHello = jest.fn();
    getListTask = jest.fn();
    createTask = jest.fn();
    findAll = jest.fn().mockResolvedValue([new Task()]);
    create = jest.fn().mockResolvedValue(new Task());
  }
describe('TaskResolver', () => {
  let resolver: TaskResolver;
  let taskService: TaskServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskResolver,
        {
            provide: TaskService,
            useValue: new TaskServiceMock(),
        },
        {
            provide: getRepositoryToken(Task),
            useClass: Repository,
        }
      ],
    }).compile();

    resolver = module.get<TaskResolver>(TaskResolver);
    taskService = module.get<TaskServiceMock>(TaskService);
  });

  describe('getListTask', () => {
    it('should return all tasks', async () => {
      const tasks = await resolver.getListTask();
      expect(tasks).toBeInstanceOf(Array);
      expect(tasks.length).toBeGreaterThan(0);
    });

    it('should verify database call', async () => {
        await resolver.getListTask();
        expect(taskService.findAll).toHaveBeenCalledTimes(1);
      });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
        const taskInput: TaskInput = {
          title: 'My new task',
        };
        const createdTask = await resolver.createTask(taskInput);
        expect(createdTask).toBeInstanceOf(Task);
        expect(taskService.create).toHaveBeenCalledTimes(1);
        expect(taskService.create).toHaveBeenCalledWith(expect.objectContaining({ title: taskInput.title }));
      });
  });
});
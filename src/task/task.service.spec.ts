import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Repository, UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Task } from './task.entity';
import { User } from '../user/user.entity';



describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return tasks with relations', async () => {
      const repositoryData: Task[] = [{ /* mock data */ }] as Task[];
      jest.spyOn(service['taskRepository'], 'find').mockResolvedValue(repositoryData);

      const result = await service.findAll();

      expect(result).toEqual(repositoryData);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const taskId = 'example_id';
      const repositoryData: Task = { /* mock data */ } as Task;
      jest.spyOn(service['taskRepository'], 'findOne').mockResolvedValue(repositoryData);

      const result = await service.findOne(taskId);

      expect(result).toEqual(repositoryData);
    });
  });

  describe('create', () => {
    it('should create a task and clear the cache', async () => {
      const taskToCreate: Task = { /* mock data */ } as Task;
      const repositoryData: Task = { ...taskToCreate, id: 'created_id' } as Task;
      jest.spyOn(service['taskRepository'], 'save').mockResolvedValue(repositoryData);
      const cacheManagerSpy = jest.spyOn(service['cacheManager'], 'del');

      const result = await service.create(taskToCreate);

      expect(result).toEqual(repositoryData);
      expect(cacheManagerSpy).toHaveBeenCalledWith('bookingList');
    });
  });
});

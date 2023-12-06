import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '../user/user.entity';



@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async findAll(): Promise<Task[]> {
    const tasks = await this.taskRepository.find({ relations: ['bookings'] });

    for (const task of tasks) {
      if (Array.isArray(task.bookings)) {
        for (const booking of task.bookings) {
          if (!booking.user) {
            booking.user = await this.userRepository.findOne({ where: { id: booking.userId } });
          }
        }
      }
    }

    return tasks;
  }

  async findOne(id: string): Promise<Task> {
    return this.taskRepository.findOne({ where: { id } });
  }

  async create(task: Task): Promise<Task> {
    await this.cacheManager.del('bookingList')
    return this.taskRepository.save(task);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { Task } from './task.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task]),TypeOrmModule.forFeature([User])],
  controllers: [TaskController],
  providers: [TaskService,TaskResolver],
})
export class TaskModule {}
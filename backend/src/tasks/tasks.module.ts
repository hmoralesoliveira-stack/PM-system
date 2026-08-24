import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { BoardColumn } from '../entities/board-column.entity';
import { TimeEntry } from '../entities/time-entry.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task, BoardColumn, TimeEntry])],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}

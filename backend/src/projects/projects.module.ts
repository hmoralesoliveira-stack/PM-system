import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { BoardColumn } from '../entities/board-column.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, BoardColumn])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}

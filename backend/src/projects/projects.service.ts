import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { BoardColumn } from '../entities/board-column.entity';

const DEFAULT_COLUMNS = [
  'A fazer',
  'Em andamento',
  'Deploy',
  'QA',
  'Testes Integrados',
  'Dossiê de Teste',
  'Concluído',
];

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private repo: Repository<Project>,
    @InjectRepository(BoardColumn) private columnsRepo: Repository<BoardColumn>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['columns', 'tasks', 'tasks.assignee', 'tasks.subtasks'],
    });
  }

  async create(data: Partial<Project>) {
    const project = await this.repo.save(this.repo.create(data));
    await this.columnsRepo.save(
      DEFAULT_COLUMNS.map((name, order) => this.columnsRepo.create({ name, order, projectId: project.id })),
    );
    return this.findOne(project.id);
  }

  async update(id: string, data: Partial<Project>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}

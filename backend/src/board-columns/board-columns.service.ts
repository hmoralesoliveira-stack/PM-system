import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardColumn } from '../entities/board-column.entity';

@Injectable()
export class BoardColumnsService {
  constructor(@InjectRepository(BoardColumn) private repo: Repository<BoardColumn>) {}

  findByProject(projectId: string) {
    return this.repo.find({ where: { projectId }, order: { order: 'ASC' } });
  }

  create(data: Partial<BoardColumn>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, data: Partial<BoardColumn>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}

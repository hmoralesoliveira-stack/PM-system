import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntry } from '../entities/time-entry.entity';

@Injectable()
export class TimeEntriesService {
  constructor(@InjectRepository(TimeEntry) private repo: Repository<TimeEntry>) {}

  findByTask(taskId: string) {
    return this.repo.find({ where: { taskId }, relations: ['user'], order: { loggedAt: 'DESC' } });
  }

  // soma de horas por usuário dentro de um período, útil pra relatórios
  findByUserAndPeriod(userId: string, from: string, to: string) {
    return this.repo
      .createQueryBuilder('entry')
      .where('entry.userId = :userId', { userId })
      .andWhere('entry.loggedAt BETWEEN :from AND :to', { from, to })
      .leftJoinAndSelect('entry.task', 'task')
      .getMany();
  }

  create(data: Partial<TimeEntry>) {
    return this.repo.save(this.repo.create(data));
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}

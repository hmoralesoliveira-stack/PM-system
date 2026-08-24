import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { BoardColumn } from '../entities/board-column.entity';
import { TimeEntry } from '../entities/time-entry.entity';

const IN_PROGRESS_COLUMN = 'Em andamento';
const DONE_COLUMN = 'Concluído';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private repo: Repository<Task>,
    @InjectRepository(BoardColumn) private columnsRepo: Repository<BoardColumn>,
    @InjectRepository(TimeEntry) private timeEntriesRepo: Repository<TimeEntry>,
  ) {}

  findByProject(projectId: string) {
    return this.repo.find({
      where: { projectId },
      relations: ['assignee', 'subtasks', 'timeEntries'],
      order: { createdAt: 'ASC' },
    });
  }

  // Usado pela página de Agenda: tarefas com vencimento no período, de todos os projetos
  findAgenda(from: string, to: string) {
    return this.repo.find({
      where: { endDate: Between(from, to) },
      relations: ['assignee', 'project', 'column'],
      order: { endDate: 'ASC' },
    });
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['assignee', 'subtasks', 'timeEntries', 'parentTask'],
    });
  }

  create(data: Partial<Task>) {
    return this.repo.save(this.repo.create(data));
  }

  // Usado pelo kanban (mudar de coluna) e pelo Gantt (mudar datas).
  // Quando a tarefa entra em "Em andamento" começa a contar o tempo; quando
  // sai para "Concluído" lança automaticamente as horas decorridas para o responsável.
  async update(id: string, data: Partial<Task>) {
    if (data.columnId) {
      const current = await this.repo.findOne({ where: { id } });
      if (current && data.columnId !== current.columnId) {
        const column = await this.columnsRepo.findOne({ where: { id: data.columnId } });

        if (column?.name === IN_PROGRESS_COLUMN && !current.inProgressSince) {
          data.inProgressSince = new Date();
        } else if (column?.name === DONE_COLUMN && current.inProgressSince) {
          const hours = (Date.now() - new Date(current.inProgressSince).getTime()) / 3_600_000;
          if (current.assigneeId && hours > 0) {
            await this.timeEntriesRepo.save(
              this.timeEntriesRepo.create({
                taskId: id,
                userId: current.assigneeId,
                hours: Math.round(hours * 100) / 100,
                loggedAt: new Date().toISOString().slice(0, 10),
                note: 'Tempo automático (Em andamento → Concluído)',
              }),
            );
          }
          data.inProgressSince = null;
        }
      }
    }

    await this.repo.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { BoardColumn } from './board-column.entity';
import { User } from './user.entity';
import { TimeEntry } from './time-entry.entity';
import { Comment } from './comment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Column({ default: 0 })
  progress: number;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @Column()
  projectId: string;

  @ManyToOne(() => Task, (task) => task.subtasks, { nullable: true, onDelete: 'CASCADE' })
  parentTask: Task;

  @Column({ nullable: true })
  parentTaskId: string;

  @OneToMany(() => Task, (task) => task.parentTask)
  subtasks: Task[];

  @ManyToOne(() => BoardColumn, (column) => column.tasks, { nullable: true })
  column: BoardColumn;

  @Column({ nullable: true })
  columnId: string;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: true })
  assignee: User;

  @Column({ nullable: true })
  assigneeId: string;

  @OneToMany(() => TimeEntry, (entry) => entry.task)
  timeEntries: TimeEntry[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  // Marca quando a tarefa entrou na coluna "Em andamento" — usado para lançar horas
  // automaticamente quando ela é movida para "Concluído".
  // SQLite (usado na instalação desktop) não suporta o tipo "timestamp".
  @Column({ type: process.env.DB_TYPE === 'sqlite' ? 'datetime' : 'timestamp', nullable: true })
  inProgressSince: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}

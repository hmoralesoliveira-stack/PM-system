import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { BoardColumn } from './board-column.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => BoardColumn, (column) => column.project)
  columns: BoardColumn[];

  @CreateDateColumn()
  createdAt: Date;
}

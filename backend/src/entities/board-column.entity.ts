import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { Task } from './task.entity';

@Entity('board_columns')
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Project, (project) => project.columns, { onDelete: 'CASCADE' })
  project: Project;

  @Column()
  projectId: string;

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('time_entries')
export class TimeEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Task, (task) => task.timeEntries, { onDelete: 'CASCADE' })
  task: Task;

  @Column()
  taskId: string;

  @ManyToOne(() => User, (user) => user.timeEntries)
  user: User;

  @Column()
  userId: string;

  @Column('float')
  hours: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'date' })
  loggedAt: string;

  @CreateDateColumn()
  createdAt: Date;
}

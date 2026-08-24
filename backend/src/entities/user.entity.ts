import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './task.entity';
import { TimeEntry } from './time-entry.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'member' })
  role: 'admin' | 'member';

  @Column({ type: 'float', nullable: true, select: false })
  hourlyRate: number | null;

  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];

  @OneToMany(() => TimeEntry, (entry) => entry.user)
  timeEntries: TimeEntry[];
}

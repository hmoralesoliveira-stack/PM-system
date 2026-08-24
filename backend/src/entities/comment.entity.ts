import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ nullable: true })
  attachmentUrl: string;

  @Column({ nullable: true })
  attachmentName: string;

  @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
  task: Task;

  @Column()
  taskId: string;

  @ManyToOne(() => User, { nullable: true })
  author: User;

  @Column({ nullable: true })
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private repo: Repository<Comment>) {}

  findByTask(taskId: string) {
    return this.repo.find({
      where: { taskId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  create(data: Partial<Comment>) {
    return this.repo.save(this.repo.create(data));
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}

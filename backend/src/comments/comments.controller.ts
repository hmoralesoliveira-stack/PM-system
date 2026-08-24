import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private service: CommentsService) {}

  @Get()
  findByTask(@Param('taskId') taskId: string) {
    return this.service.findByTask(taskId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  create(
    @Param('taskId') taskId: string,
    @Body('text') text: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.create({
      taskId,
      text,
      authorId: user.id,
      attachmentUrl: file ? `/uploads/${file.filename}` : undefined,
      attachmentName: file ? file.originalname : undefined,
    });
  }
}

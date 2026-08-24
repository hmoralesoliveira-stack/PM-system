import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { BoardColumnsModule } from './board-columns/board-columns.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AdminModule } from './admin/admin.module';
import { CommentsModule } from './comments/comments.module';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { BoardColumn } from './entities/board-column.entity';
import { TimeEntry } from './entities/time-entry.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '5432', 10),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, Project, Task, BoardColumn, TimeEntry, Comment],
        synchronize: true, // apenas para desenvolvimento — trocar por migrations em produção
      }),
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    ProjectsModule,
    TasksModule,
    BoardColumnsModule,
    TimeEntriesModule,
    CommentsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}

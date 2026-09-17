import { mkdirSync } from 'fs';
import { dirname } from 'path';
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
      useFactory: (config: ConfigService) => {
        const entities = [User, Project, Task, BoardColumn, TimeEntry, Comment];

        // Instalação local (desktop): usa um arquivo SQLite, sem precisar de
        // Postgres/Docker instalado na máquina do usuário.
        if (config.get<string>('DB_TYPE') === 'sqlite') {
          const dbPath = config.get<string>('DB_SQLITE_PATH') || './data/pmsystem.sqlite';
          mkdirSync(dirname(dbPath), { recursive: true });
          return {
            type: 'better-sqlite3' as const,
            database: dbPath,
            entities,
            synchronize: true,
          };
        }

        // Provedores como Railway/Render expõem a conexão do Postgres como uma
        // única DATABASE_URL; localmente usamos as variáveis DB_* separadas.
        const databaseUrl = config.get<string>('DATABASE_URL');
        const ssl = config.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false;
        const connection = databaseUrl
          ? { url: databaseUrl }
          : {
              host: config.get<string>('DB_HOST'),
              port: parseInt(config.get<string>('DB_PORT') || '5432', 10),
              username: config.get<string>('DB_USER'),
              password: config.get<string>('DB_PASSWORD'),
              database: config.get<string>('DB_NAME'),
            };
        return {
          type: 'postgres' as const,
          ...connection,
          ssl,
          entities,
          synchronize: true, // apenas para desenvolvimento — trocar por migrations em produção
        };
      },
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

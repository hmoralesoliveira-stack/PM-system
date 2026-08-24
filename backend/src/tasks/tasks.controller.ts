import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private service: TasksService) {}

  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.service.findByProject(projectId);
  }

  @Get('agenda')
  agenda(@Query('from') from: string, @Query('to') to: string) {
    return this.service.findAgenda(from, to);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

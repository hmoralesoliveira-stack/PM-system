import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';

@Controller('time-entries')
export class TimeEntriesController {
  constructor(private service: TimeEntriesService) {}

  @Get('by-task/:taskId')
  findByTask(@Param('taskId') taskId: string) {
    return this.service.findByTask(taskId);
  }

  @Get('report')
  report(
    @Query('userId') userId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.service.findByUserAndPeriod(userId, from, to);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

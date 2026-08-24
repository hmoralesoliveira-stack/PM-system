import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BoardColumnsService } from './board-columns.service';

@Controller('board-columns')
export class BoardColumnsController {
  constructor(private service: BoardColumnsService) {}

  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.service.findByProject(projectId);
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

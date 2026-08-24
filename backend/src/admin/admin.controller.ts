import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { AdminGuard } from '../auth/admin.guard';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

function generateTempPassword() {
  return randomBytes(6).toString('base64url');
}

@UseGuards(AdminGuard)
@Controller('admin/members')
export class AdminController {
  constructor(private users: UsersService) {}

  @Get()
  list() {
    return this.users.findAllWithRate();
  }

  @Post()
  async invite(@Body() dto: InviteMemberDto) {
    const temporaryPassword = generateTempPassword();
    const user = await this.users.create({
      name: dto.name,
      email: dto.email,
      password: temporaryPassword,
      hourlyRate: dto.hourlyRate ?? null,
      role: 'member',
    });
    return { user, temporaryPassword };
  }

  @Patch(':id/rate')
  async updateRate(@Param('id') id: string, @Body() dto: UpdateRateDto) {
    await this.users.update(id, { hourlyRate: dto.hourlyRate });
    return this.users.findOneWithRate(id);
  }
}

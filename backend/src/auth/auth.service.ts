import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  private signFor(user: { id: string; email: string; name: string; role: string }) {
    const token = this.jwt.sign({ sub: user.id, email: user.email, name: user.name });
    return { token, user };
  }

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmailWithPassword(dto.email);
    if (existing) throw new ConflictException('Este e-mail já está cadastrado');
    const isFirstUser = (await this.users.count()) === 0;
    const user = await this.users.create({ ...dto, role: isFirstUser ? 'admin' : 'member' });
    return this.signFor(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');
    return this.signFor({ id: user.id, email: user.email, name: user.name, role: user.role });
  }
}

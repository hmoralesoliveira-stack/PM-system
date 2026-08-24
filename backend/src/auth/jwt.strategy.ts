import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

export type JwtPayload = { sub: string; email: string; name: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET') || 'dev-secret-change-me',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.users.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}

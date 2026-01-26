import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH_CLIENT') private readonly authClient: ClientProxy) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: {
    userName: string;
    sub: string;
    role: 'USER' | 'ADMIN';
  }) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user = await firstValueFrom(
        this.authClient.send('users.findOneUser', payload.sub),
      );
      return user as {
        id: string;
        email: string;
        userName: string;
        role: 'USER' | 'ADMIN';
        lastSeen: Date;
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

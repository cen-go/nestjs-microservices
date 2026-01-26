import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.login')
  async login(@Payload() data: { userName: string; password: string }) {
    const user = await this.authService.validateUser(
      data.userName,
      data.password,
    );
    return this.authService.login(user);
  }

  @MessagePattern('service.ping')
  ping() {
    return { ok: true, service: 'auth' };
  }
}

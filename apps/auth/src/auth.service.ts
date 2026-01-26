import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UsersService } from './users/users.service';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/auth-db-client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    userName: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const userResult = await this.usersService.findOne(userName);

    // Compare password
    const isPasswordMatch = await bcrypt.compare(pass, userResult.password);

    if (!isPasswordMatch) {
      throw new RpcException({
        message: 'Invalid credentials',
        statusCode: 401,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = userResult;
    return user;
  }

  login(user: Omit<User, 'password'>) {
    const payload = { userName: user.userName, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

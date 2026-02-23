import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/auth-db-client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new RpcException({
        message: 'User already exists!',
        statusCode: 409,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = newUser;
    return user;
  }

  async findUserById(id: string) {
    const userResult = await this.prisma.user.findUnique({ where: { id } });
    if (!userResult) {
      throw new RpcException({ message: 'User not found!', statusCode: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...user } = userResult;
    return user;
  }

  async findOne(userName: string) {
    const userResult = await this.prisma.user.findUnique({
      where: { userName },
    });

    if (!userResult) {
      throw new RpcException({
        message: 'Invalid credentials!',
        statusCode: 401,
      });
    }

    return userResult;
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: updateUserDto.id },
    });

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        statusCode: 401,
      });
    }

    console.log(user);

    return await this.prisma.user.update({
      where: { id: updateUserDto.id },
      data: {
        userName: updateUserDto.userName ?? user.userName,
        role: updateUserDto.role ?? Role.USER,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

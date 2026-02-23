import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users.createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('users.findOneUser')
  findOne(@Payload() id: string) {
    return this.usersService.findUserById(id);
  }

  @MessagePattern('users.updateUser')
  update(@Payload() payload: UpdateUserDto) {
    return this.usersService.update(payload);
  }

  @MessagePattern('users.removeUser')
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}

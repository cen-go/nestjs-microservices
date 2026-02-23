import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/auth-db-client';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'name should be at least 3 charactes long.' })
  @MaxLength(50, { message: 'Name can not be longer than 50 charactes.' })
  userName: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role. Accepted roles are ADMIN and USER' })
  role: Role;
}

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'username is required.' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'name should be at least 3 charactes long.' })
  @MaxLength(50, { message: 'Name can not be longer than 50 charactes.' })
  userName: string;
}

import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  usernameOrEmail: string;

  @IsString()
  @MinLength(8)
  password: string;
}
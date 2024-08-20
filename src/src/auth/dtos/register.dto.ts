import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, { message : 'username can only be alphanumeric' })
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

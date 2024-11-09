import { IsEmail, IsInt, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @MinLength(6)
  @IsOptional()
  password: string;

  @IsInt()
  roleId: number;
}

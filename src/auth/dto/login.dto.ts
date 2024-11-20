import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ description: 'Correo electrónico del usuario' })
  email: string;

  @MinLength(6)
  @ApiProperty({ description: 'Contraseña del usuario' })
  password: string;
}

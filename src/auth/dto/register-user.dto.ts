import { IsEmail, IsInt, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsEmail()
  @ApiProperty({ description: 'Correo electrónico del usuario' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Nombre del usuario' })
  name: string;

  @MinLength(6)
  @IsOptional()
  @ApiProperty({ description: 'Contraseña del usuario' })
  password: string;

  @IsInt()
  @ApiProperty({ description: 'ID del rol del usuario' })
  roleId: number;
}

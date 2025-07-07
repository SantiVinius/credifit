import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    description: 'Email do funcionário',
    example: 'joao.silva@empresa.com',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do funcionário (mínimo 6 caracteres)',
    example: 'senha123',
    type: String,
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;
}

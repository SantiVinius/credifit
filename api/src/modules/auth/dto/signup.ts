import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'Nome completo do funcionário',
    example: 'João Silva Santos',
    type: String
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({
    description: 'CPF do funcionário (com ou sem formatação)',
    example: '123.456.789-09',
    type: String
  })
  @IsString({ message: 'CPF deve ser uma string' })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  cpf: string;

  @ApiProperty({
    description: 'Salário do funcionário em reais',
    example: 3500.00,
    type: Number,
    minimum: 0
  })
  @IsNumber({}, { message: 'Salário deve ser um número' })
  @IsNotEmpty({ message: 'Salário é obrigatório' })
  @Min(0, { message: 'Salário deve ser maior que zero' })
  salario: number;

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

  @ApiProperty({
    description: 'ID da empresa onde o funcionário trabalha',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    format: 'uuid'
  })
  @IsNotEmpty()
  @IsUUID()
  idEmpresa: string;
}

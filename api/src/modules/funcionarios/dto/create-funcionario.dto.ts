import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateFuncionarioDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  senha: string;

  @IsNotEmpty()
  @IsNumber()
  salario: number;

  @IsNotEmpty()
  @IsUUID()
  idEmpresa: string;
}

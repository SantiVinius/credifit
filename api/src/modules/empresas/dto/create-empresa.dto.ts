import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateEmpresaDto {
  @IsNotEmpty()
  @IsString()
  cnpj: string;

  @IsNotEmpty()
  @IsString()
  razaoSocial: string;

  @IsNotEmpty()
  @IsString()
  nomeRepresentante: string;

  @IsNotEmpty()
  @IsString()
  cpfRepresentante: string;

  @IsNotEmpty()
  @IsEmail()
  emailRepresentante: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  senha: string;
}

import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateEmprestimoDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(100)
  valorSolicitado: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(4)
  quantidadeParcelas: number;
}

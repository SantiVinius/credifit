import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class SimulateEmprestimo {
  @IsNotEmpty({ message: 'valorSolicitado é obrigatório' })
  @IsNumber({}, { message: 'valorSolicitado deve ser um número' })
  @Min(100, { message: 'valorSolicitado deve ser pelo menos 100' })
  valorSolicitado: number;
}

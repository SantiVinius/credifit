import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateEmprestimoDto } from './dto/create-emprestimo.dto';
import { SimulateEmprestimo } from './dto/simulate-emprestimo.dto';
import { FuncionarioRepository } from '../../shared/database/repositories/funcionario.repository';
import { EmprestimoRepository } from '../../shared/database/repositories/emprestimo.repository';
import { ParcelasRepository } from '../../shared/database/repositories/parcelas.repository';
import { FAIXAS_SALARIO, STATUS_EMPRESTIMO } from '../../utils/constants';

@Injectable()
export class EmprestimoService {
  constructor(
    private readonly funcionarioRepo: FuncionarioRepository,
    private readonly emprestimoRepo: EmprestimoRepository,
    private readonly parcelaRepo: ParcelasRepository,
  ) {}

  async findAll(userId: string) {
    const emprestimos = await this.emprestimoRepo.findMany({
      where: {
        idFuncionario: userId,
      },
      include: {
        funcionario: {
          include: {
            empresa: {
              select: {
                nomeRepresentante: true,
                razaoSocial: true,
                cnpj: true,
              },
            },
          },
        },
        parcelas: {
          select: {
            numeroParcela: true,
            valor: true,
            dataVencimento: true,
          },
        },
      },
    });
    return emprestimos;
  }

  async simular(data: SimulateEmprestimo, userId: string) {
    const { valorSolicitado } = data;

    // 1. Verifique o funcionário e a margem de crédito
    const funcionario = await this.funcionarioRepo.findUnique({
      where: { id: userId },
    });

    if (!funcionario) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    // 2. Validar margem de crédito (35% do salário)
    const margemCredito = funcionario.salario * 0.35;
    if (valorSolicitado > margemCredito) {
      throw new BadRequestException(
        `Valor solicitado (R$ ${valorSolicitado.toFixed(2)}) excede a margem de crédito disponível (R$ ${margemCredito.toFixed(2)})`,
      );
    }

    // 3. Gerar as opções de parcelamento (de 1 a 4 vezes)
    const opcoesParcelamento = this.calcularParcelas(valorSolicitado);

    // 4. Retornar as opções de parcelamento para o usuário
    return {
      valorSolicitado,
      margemCredito,
      opcoesParcelamento,
    };
  }

  async create(data: CreateEmprestimoDto, userId: string) {
    const { valorSolicitado, quantidadeParcelas } = data;

    const funcionario = await this.funcionarioRepo.findUnique({
      where: { id: userId },
    });

    if (!funcionario) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    const salario = funcionario.salario;
    const margemCredito = salario * 0.35; // 35% do salário

    if (valorSolicitado > margemCredito) {
      throw new ConflictException(
        'Empréstimo solicitado excede a margem de crédito.',
      );
    }

    // 2. Consultar o score de crédito
    const score = await this.consultarScore(funcionario.id);

    let statusEmprestimo;
    if (score < this.validarScore(salario)) {
      statusEmprestimo = STATUS_EMPRESTIMO.REPROVADO;
    } else {
      statusEmprestimo = STATUS_EMPRESTIMO.APROVADO;
    }

    // 3. Criar o empréstimo
    const emprestimo = await this.emprestimoRepo.create({
      data: {
        valorSolicitado,
        quantidadeParcelas,
        idFuncionario: userId,
        scoreUtilizado: score,
        statusAprovacao: statusEmprestimo,
      },
    });

    if (emprestimo.statusAprovacao === STATUS_EMPRESTIMO.APROVADO) {
      // 4. Gerar as parcelas
      await this.gerarParcelas(
        emprestimo.id,
        valorSolicitado,
        quantidadeParcelas,
      );

      // 5. Simular pagamento
      await this.simularPagamento(emprestimo.id, userId);
    }

    return emprestimo;
  }

  async gerarParcelas(
    idEmprestimo: string,
    valorSolicitado: number,
    quantidadeParcelas: number,
  ) {
    const valorParcela = valorSolicitado / quantidadeParcelas;
    const dataAtual = new Date();

    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date(dataAtual);
      dataVencimento.setMonth(dataVencimento.getMonth() + i + 1);

      await this.parcelaRepo.create({
        data: {
          idEmprestimo,
          numeroParcela: i + 1,
          valor: valorParcela,
          dataVencimento,
        },
      });
    }
  }

  async consultarScore(userId: string): Promise<number> {
    try {
      const response = await axios.get(
        'https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf',
        { timeout: 5000 }, // Timeout de 5 segundos
      );
      return response.data.score;
    } catch (error) {
      console.error('Erro ao consultar o score', error);
      // Fallback: retorna score padrão baseado no salário
      const funcionario = await this.funcionarioRepo.findUnique({
        where: { id: userId },
      });
      return this.validarScore(funcionario?.salario || 0);
    }
  }

  async simularPagamento(emprestimoId: string, userId: string) {
    try {
      const response = await axios.get(
        'https://mocki.io/v1/386c594b-d42f-4d14-8036-508a0cf1264c',
        { timeout: 5000 }, // Timeout de 5 segundos
      );

      if (response.data.status !== 'aprovado') {
        throw new ConflictException('Pagamento do empréstimo não aprovado');
      }
    } catch (error) {
      console.error('Erro ao simular pagamento', error);
      // Re-throw the error if it's a ConflictException
      if (error instanceof ConflictException) {
        throw error;
      }
    }
  }

  private calcularParcelas(valorSolicitado: number) {
    const opcoes: Array<{ parcelas: number; valorParcela: number }> = [];
    for (let i = 1; i <= 4; i++) {
      const valorParcela = (valorSolicitado / i).toFixed(2); // Calculando o valor da parcela
      opcoes.push({
        parcelas: i,
        valorParcela: parseFloat(valorParcela), // Garantindo que seja um número
      });
    }

    return opcoes;
  }

  private validarScore(salario: number): number {
    for (const faixa of FAIXAS_SALARIO) {
      if (salario <= faixa.limite) {
        return faixa.score;
      }
    }

    return 700;
  }
}

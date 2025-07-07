import { Injectable } from '@nestjs/common';
import { FuncionarioRepository } from '../../../shared/database/repositories/funcionario.repository';
import { CreateFuncionarioDto } from '../dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from '../dto/update-funcionario.dto';
import { ValidateFuncionarioService } from './validate-funcionarios.service';

@Injectable()
export class FuncionarioService {
  constructor(
    private readonly funcionarioRepo: FuncionarioRepository,
    private readonly validateFuncionarioService: ValidateFuncionarioService,
  ) {}

  async create(data: CreateFuncionarioDto) {
    const { nome, cpf, email, salario, senha, idEmpresa } = data;

    await this.validateFuncionarioService.validate(cpf, email, idEmpresa);

    return this.funcionarioRepo.create({
      data: {
        nome,
        cpf,
        email,
        salario,
        senha,
        idEmpresa,
      },
    });
  }

  async findAll() {
    return this.funcionarioRepo.findMany({
      include: {
        empresa: {
          select: { razaoSocial: true, cnpj: true },
        },
        emprestimos: true,
      },
    });
  }

  async update(idFuncionario: string, data: UpdateFuncionarioDto) {
    return this.funcionarioRepo.update({
      where: { id: idFuncionario },
      data,
    });
  }

  async remove(idFuncionario: string) {
    await this.funcionarioRepo.delete({
      where: { id: idFuncionario },
    });
    return null;
  }
}

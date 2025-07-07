import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { EmpresaRepository } from '../../../shared/database/repositories/empresa.repository';
import { FuncionarioRepository } from '../../../shared/database/repositories/funcionario.repository';
import { isValidCPF, normalizeCPF } from '../../../utils/validators';

@Injectable()
export class ValidateFuncionarioService {
  constructor(
    private readonly funcionariosRepo: FuncionarioRepository,
    private readonly empresasRepo: EmpresaRepository,
  ) {}

  async validate(
    cpfFuncionario: string,
    emailFuncionario: string,
    idEmpresa: string,
  ) {
    if (!isValidCPF(cpfFuncionario)) {
      throw new BadRequestException('CPF do funcionário inválido.');
    }

    const cpf = normalizeCPF(cpfFuncionario);
    const cpfExists = await this.funcionariosRepo.findUnique({
      where: { cpf: cpf },
    });

    if (cpfExists) {
      throw new ConflictException('CPF já cadastrado');
    }

    const email = emailFuncionario.toLowerCase();
    const emailExists = await this.funcionariosRepo.findUnique({
      where: { email },
    });

    if (emailExists) {
      throw new ConflictException('E-mail do funcionário já cadastrado');
    }

    const empresa = await this.empresasRepo.findUnique({
      where: { id: idEmpresa },
    });

    if (!empresa) {
      throw new BadRequestException('Empresa não encontrada');
    }
  }
}

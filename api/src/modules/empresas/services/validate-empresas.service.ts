import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { EmpresaRepository } from '../../../shared/database/repositories/empresa.repository';
import {
  isValidCNPJ,
  isValidCPF,
  normalizeCNPJ,
  normalizeCPF,
} from '../../../utils/validators';

@Injectable()
export class ValidateEmpresaService {
  constructor(private readonly empresasRepo: EmpresaRepository) {}

  async validate(
    cnpjRepresentante: string,
    cpfRepresentante: string,
    emailRepresentante: string,
  ) {
    if (!isValidCNPJ(cnpjRepresentante)) {
      throw new BadRequestException('CNPJ inválido.');
    }

    const cnpj = normalizeCNPJ(cnpjRepresentante);
    const cnpjExists = await this.empresasRepo.findUnique({
      where: { cnpj: cnpj },
    });

    if (cnpjExists) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    if (!isValidCPF(cpfRepresentante)) {
      throw new BadRequestException('CPF do representante inválido.');
    }

    const cpf = normalizeCPF(cpfRepresentante);
    const cpfExists = await this.empresasRepo.findUnique({
      where: { cpfRepresentante: cpf },
    });

    if (cpfExists) {
      throw new ConflictException('CPF do representante já cadastrado');
    }

    const email = emailRepresentante.toLowerCase();
    const emailExists = await this.empresasRepo.findUnique({
      where: { emailRepresentante: email },
    });

    if (emailExists) {
      throw new ConflictException('E-mail do representante já cadastrado');
    }
  }
}

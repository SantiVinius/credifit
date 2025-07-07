import { Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from '../dto/create-empresa.dto';
import { UpdateEmpresaDto } from '../dto/update-empresa.dto';
import { EmpresaRepository } from 'src/shared/database/repositories/empresa.repository';
import { ValidateEmpresaService } from './validate-empresas.service';

@Injectable()
export class EmpresaService {
  constructor(
    private readonly empresasRepo: EmpresaRepository,
    private readonly validateEmpresaService: ValidateEmpresaService,
  ) {}

  async create(data: CreateEmpresaDto) {
    const {
      cnpj,
      cpfRepresentante: cpf,
      emailRepresentante: email,
      nomeRepresentante,
      razaoSocial,
      senha,
    } = data;

    await this.validateEmpresaService.validate(cnpj, cpf, email);

    return await this.empresasRepo.create({
      data: {
        cnpj,
        cpfRepresentante: cpf,
        emailRepresentante: email,
        nomeRepresentante,
        razaoSocial,
        senha,
      },
    });
  }

  async findAll() {
    const empresas = await this.empresasRepo.findMany({
      include: { funcionarios: true },
    });
    return empresas;
  }

  async update(idEmpresa: string, data: UpdateEmpresaDto) {
    return this.empresasRepo.update({
      where: { id: idEmpresa },
      data,
    });
  }

  async remove(idEmpresa: string) {
    await this.empresasRepo.delete({ where: { id: idEmpresa } });

    return null;
  }
}

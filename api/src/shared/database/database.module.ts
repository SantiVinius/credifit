import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EmpresaRepository } from './repositories/empresa.repository';
import { FuncionarioRepository } from './repositories/funcionario.repository';
import { EmprestimoRepository } from './repositories/emprestimo.repository';
import { ParcelasRepository } from './repositories/parcelas.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    EmpresaRepository,
    FuncionarioRepository,
    EmprestimoRepository,
    ParcelasRepository,
  ],
  exports: [
    EmpresaRepository,
    FuncionarioRepository,
    EmprestimoRepository,
    ParcelasRepository,
  ],
})
export class DatabaseModule {}

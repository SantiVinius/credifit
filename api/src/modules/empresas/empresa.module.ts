import { Module } from '@nestjs/common';
import { EmpresaService } from './services/empresa.service';
import { EmpresaController } from './empresa.controller';
import { ValidateEmpresaService } from './services/validate-empresas.service';

@Module({
  controllers: [EmpresaController],
  providers: [EmpresaService, ValidateEmpresaService],
})
export class EmpresaModule {}

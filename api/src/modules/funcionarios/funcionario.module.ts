import { Module } from '@nestjs/common';
import { FuncionarioController } from './funcionario.controller';
import { FuncionarioService } from './services/funcionario.service';
import { ValidateFuncionarioService } from './services/validate-funcionarios.service';

@Module({
  controllers: [FuncionarioController],
  providers: [FuncionarioService, ValidateFuncionarioService],
})
export class FuncionarioModule {}

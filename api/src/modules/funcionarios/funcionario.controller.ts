import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FuncionarioService } from './services/funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

@Controller('funcionarios')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Post()
  async create(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return await this.funcionarioService.create(createFuncionarioDto);
  }

  @Get()
  findAll() {
    return this.funcionarioService.findAll();
  }

  @Put(':idFuncionario')
  update(
    @Param('idFuncionario', ParseUUIDPipe) id: string,
    @Body() updateFuncionarioDto: UpdateFuncionarioDto,
  ) {
    return this.funcionarioService.update(id, updateFuncionarioDto);
  }

  @Delete(':idFuncionario')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('idFuncionario', ParseUUIDPipe) id: string) {
    return this.funcionarioService.remove(id);
  }
}

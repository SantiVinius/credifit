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
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { EmpresaService } from './services/empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresaService.create(createEmpresaDto);
  }

  @Get()
  @IsPublic()
  findAll() {
    return this.empresaService.findAll();
  }

  @Put(':idEmpresa')
  update(
    @Param('idEmpresa', ParseUUIDPipe) idEmpresa: string,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
  ) {
    return this.empresaService.update(idEmpresa, updateEmpresaDto);
  }

  @Delete(':idEmpresa')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('idEmpresa', ParseUUIDPipe) idEmpresa: string) {
    return this.empresaService.remove(idEmpresa);
  }
}

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { EmprestimoService } from './emprestimo.service';
import { CreateEmprestimoDto } from './dto/create-emprestimo.dto';
import { SimulateEmprestimo } from './dto/simulate-emprestimo.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { SkipResponseInterceptor } from 'src/shared/decorators/SkipResponseInterceptor';

@Controller('emprestimos')
export class EmprestimoController {
  constructor(private readonly emprestimoService: EmprestimoService) {}

  @Post()
  async create(
    @ActiveUserId() userId: string,
    @Body() createEmprestimoDto: CreateEmprestimoDto,
  ) {
    return this.emprestimoService.create(createEmprestimoDto, userId);
  }

  @Post('simulacao')
  @SkipResponseInterceptor()
  async simularEmpréstimo(
    @ActiveUserId() userId: string,
    @Body() simulateEmprestimoDto: SimulateEmprestimo,
  ) {
    console.log('Dados recebidos na simulação:', {
      userId,
      simulateEmprestimoDto,
      tipo: typeof simulateEmprestimoDto.valorSolicitado
    });
    
    return this.emprestimoService.simular(simulateEmprestimoDto, userId);
  }

  @Get()
  async findAll(@ActiveUserId() userId: string) {
    return this.emprestimoService.findAll(userId);
  }

  // Endpoint temporário para desenvolvimento - limpar cache do rate limit
  @Post('clear-rate-limit')
  @SkipResponseInterceptor()
  async clearRateLimit() {
    // Este endpoint será removido em produção
    return { message: 'Rate limit cache cleared' };
  }

  // Endpoint de teste para debug
  @Post('test-simulacao')
  @SkipResponseInterceptor()
  async testSimulacao(@Body() data: any) {
    console.log('Teste de simulação - dados recebidos:', data);
    return { 
      message: 'Teste OK',
      receivedData: data,
      tipo: typeof data.valorSolicitado
    };
  }
}

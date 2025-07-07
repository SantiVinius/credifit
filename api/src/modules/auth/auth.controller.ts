import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin';
import { SignupDto } from './dto/signup';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { AuthRateLimitGuard } from 'src/shared/guards/auth-rate-limit.guard';
import { AuthGuard } from './auth.guard';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { SkipResponseInterceptor } from 'src/shared/decorators/SkipResponseInterceptor';

@ApiTags('auth')
@Controller('auth')
@UseGuards(AuthRateLimitGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @IsPublic()
  @SkipResponseInterceptor()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Realizar login',
    description:
      'Autentica um funcionário usando email e senha, retornando um token JWT',
  })
  @ApiBody({
    type: SigninDto,
    description: 'Credenciais de login do funcionário',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  @ApiResponse({
    status: 429,
    description: 'Muitas tentativas de login. Tente novamente em 5 minutos.',
  })
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  @IsPublic()
  @SkipResponseInterceptor()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar novo funcionário',
    description: 'Cria uma nova conta de funcionário e retorna um token JWT',
  })
  @ApiBody({
    type: SignupDto,
    description: 'Dados do funcionário para cadastro',
  })
  @ApiResponse({
    status: 201,
    description: 'Funcionário cadastrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou empresa não encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
  })
  @ApiResponse({
    status: 429,
    description: 'Muitas tentativas de cadastro. Tente novamente em 5 minutos.',
  })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @SkipResponseInterceptor()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar informações do usuário logado',
    description: 'Retorna as informações do funcionário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Informações do usuário retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid' },
        nome: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao@empresa.com' },
        cpf: { type: 'string', example: '123.456.789-00' },
        salario: { type: 'number', example: 5000.0 },
        idEmpresa: { type: 'string', example: 'uuid' },
        empresa: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            razaoSocial: { type: 'string', example: 'Empresa LTDA' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  me(@ActiveUserId() userId: string) {
    return this.authService.me(userId);
  }

  // Endpoint temporário para desenvolvimento - limpar cache do rate limit
  @Post('clear-rate-limit')
  @IsPublic()
  @SkipResponseInterceptor()
  async clearRateLimit() {
    // Este endpoint será removido em produção
    return { message: 'Auth rate limit cache cleared' };
  }
}

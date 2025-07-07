import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
// import { UsersRepository } from 'src/shared/database/repositories/users.repository';
import { SigninDto } from './dto/signin';
import { SignupDto } from './dto/signup';
import { FuncionarioRepository } from 'src/shared/database/repositories/funcionario.repository';
import { EmpresaRepository } from 'src/shared/database/repositories/empresa.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly funcionarioRepo: FuncionarioRepository,
    private readonly jwtService: JwtService,
    private readonly empresaRepo: EmpresaRepository,
  ) {}

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const user = await this.funcionarioRepo.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await compare(password, user.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken };
  }

  async signup(signupDto: SignupDto) {
    const { nome, cpf, salario, email, password, idEmpresa } = signupDto;

    const emailTaken = await this.funcionarioRepo.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailTaken) {
      throw new ConflictException('This email is already in use');
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.funcionarioRepo.create({
      data: {
        nome,
        cpf,
        salario,
        email,
        senha: hashedPassword,
        empresa: {
          connect: {
            id: idEmpresa,
          },
        },
      },
    });

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken };
  }

  async me(userId: string) {
    const user = await this.funcionarioRepo.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const empresa = await this.empresaRepo.findUnique({
      where: { id: user.idEmpresa },
      select: {
        id: true,
        razaoSocial: true,
      },
    });

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      salario: user.salario,
      idEmpresa: user.idEmpresa,
      empresa,
    };
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId });
  }
}

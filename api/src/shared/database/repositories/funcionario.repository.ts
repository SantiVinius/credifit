import { Injectable } from '@nestjs/common';
import { type Prisma } from '../../../../generated/prisma';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FuncionarioRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany<T extends Prisma.FuncionarioFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.FuncionarioFindManyArgs>,
  ) {
    return this.prismaService.funcionario.findMany(findManyDto);
  }

  async findUnique(findUniqueDto: Prisma.FuncionarioFindUniqueArgs) {
    return this.prismaService.funcionario.findUnique(findUniqueDto);
  }

  async create(createDto: Prisma.FuncionarioCreateArgs) {
    return this.prismaService.funcionario.create(createDto);
  }

  async update(updateDto: Prisma.FuncionarioUpdateArgs) {
    return this.prismaService.funcionario.update(updateDto);
  }

  async delete(deleteDto: Prisma.FuncionarioDeleteArgs) {
    return this.prismaService.funcionario.delete(deleteDto);
  }
}

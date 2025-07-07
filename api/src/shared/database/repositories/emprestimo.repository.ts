import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '../../../shared/database/prisma.service';

@Injectable()
export class EmprestimoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany<T extends Prisma.EmprestimoFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.EmprestimoFindManyArgs>,
  ) {
    return this.prismaService.emprestimo.findMany(findManyDto);
  }

  async findUnique(findUniqueDto: Prisma.EmprestimoFindUniqueArgs) {
    return this.prismaService.emprestimo.findUnique(findUniqueDto);
  }

  async create(createDto: Prisma.EmprestimoCreateArgs) {
    return this.prismaService.emprestimo.create(createDto);
  }

  async update(updateDto: Prisma.EmprestimoUpdateArgs) {
    return this.prismaService.emprestimo.update(updateDto);
  }

  async delete(deleteDto: Prisma.EmprestimoDeleteArgs) {
    return this.prismaService.emprestimo.delete(deleteDto);
  }
}

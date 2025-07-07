import { Injectable } from '@nestjs/common';
import { type Prisma } from '../../../../generated/prisma';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EmpresaRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany<T extends Prisma.EmpresaFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.EmpresaFindManyArgs>,
  ) {
    return this.prismaService.empresa.findMany(findManyDto);
  }

  async findUnique(findUniqueDto: Prisma.EmpresaFindUniqueArgs) {
    return this.prismaService.empresa.findUnique(findUniqueDto);
  }

  async create(createDto: Prisma.EmpresaCreateArgs) {
    return this.prismaService.empresa.create(createDto);
  }

  async update(updateDto: Prisma.EmpresaUpdateArgs) {
    return this.prismaService.empresa.update(updateDto);
  }

  async delete(deleteDto: Prisma.EmpresaDeleteArgs) {
    return this.prismaService.empresa.delete(deleteDto);
  }
}

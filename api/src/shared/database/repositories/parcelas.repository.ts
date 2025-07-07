import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '../../../shared/database/prisma.service';

@Injectable()
export class ParcelasRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // Criar uma nova parcela
  async create(createDto: Prisma.ParcelaCreateArgs) {
    return this.prismaService.parcela.create(createDto);
  }
}

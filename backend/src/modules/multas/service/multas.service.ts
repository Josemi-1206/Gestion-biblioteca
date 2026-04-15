import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMultaDto } from '../dto/create-multa.dto';
import { UpdateMultaDto } from '../dto/update-multa.dto';

@Injectable()
export class MultasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.multa.findMany({ include: { prestamo: true } });
  }

  async findOne(id: number) {
    const multa = await this.prisma.multa.findUnique({ where: { id }, include: { prestamo: true } });
    if (!multa) throw new NotFoundException(`Multa #${id} no encontrada`);
    return multa;
  }

  create(dto: CreateMultaDto) {
    return this.prisma.multa.create({ data: dto });
  }

  async update(id: number, dto: UpdateMultaDto) {
    await this.findOne(id);
    return this.prisma.multa.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.multa.delete({ where: { id } });
  }
}
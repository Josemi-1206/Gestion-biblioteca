import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMultaDto } from '../dto/create-multa.dto';
import { UpdateMultaDto } from '../dto/update-multa.dto';

@Injectable()
export class MultasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.multa.findMany({
      include: { prestamo: true },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.multa.findUnique({
      where: { id },
      include: { prestamo: true },
    });
  }

  findByPrestamo(prestamoId: number) {
    return this.prisma.multa.findUnique({ where: { prestamoId } });
  }

  create(dto: CreateMultaDto) {
    return this.prisma.multa.create({
      data: dto,
      include: { prestamo: true },
    });
  }

  update(id: number, dto: UpdateMultaDto) {
    return this.prisma.multa.update({
      where: { id },
      data: dto,
      include: { prestamo: true },
    });
  }

  remove(id: number) {
    return this.prisma.multa.delete({ where: { id } });
  }
}

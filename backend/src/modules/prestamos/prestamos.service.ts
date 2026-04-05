import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';

@Injectable()
export class PrestamosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.prestamo.findMany({ include: { usuario: true, ejemplar: true } });
  }

  async findOne(id: number) {
    const prestamo = await this.prisma.prestamo.findUnique({ where: { id }, include: { usuario: true, ejemplar: true } });
    if (!prestamo) throw new NotFoundException(`Préstamo #${id} no encontrado`);
    return prestamo;
  }

  create(dto: CreatePrestamoDto) {
    return this.prisma.prestamo.create({ data: {
      usuarioId: dto.usuarioId,
      ejemplarId: dto.ejemplarId,
      fechaDevolucionEsperada: new Date(dto.fechaDevolucionEsperada),
    }});
  }

  async update(id: number, dto: UpdatePrestamoDto) {
    await this.findOne(id);
    return this.prisma.prestamo.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.prestamo.delete({ where: { id } });
  }
}
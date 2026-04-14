import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePrestamoDto } from '../dto/create-prestamo.dto';
import { UpdatePrestamoDto } from '../dto/update-prestamo.dto';

@Injectable()
export class PrestamosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.prestamo.findMany({
      include: { usuario: true, ejemplar: true },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.prestamo.findUnique({
      where: { id },
      include: { usuario: true, ejemplar: true },
    });
  }

  create(data: { usuarioId: number; ejemplarId: number; fechaDevolucionEsperada: Date }) {
    return this.prisma.prestamo.create({
      data,
      include: { usuario: true, ejemplar: true },
    });
  }

  update(id: number, dto: UpdatePrestamoDto) {
    return this.prisma.prestamo.update({
      where: { id },
      data: dto,
      include: { usuario: true, ejemplar: true },
    });
  }

  remove(id: number) {
    return this.prisma.prestamo.delete({ where: { id } });
  }
}

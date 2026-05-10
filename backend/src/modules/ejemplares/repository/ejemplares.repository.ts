import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEjemplarDto } from '../dto/create-ejemplar.dto';
import { UpdateEjemplarDto } from '../dto/update-ejemplar.dto';
import { EstadoEjemplar } from '@prisma/client';

@Injectable()
export class EjemplaresRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.ejemplar.findMany({
      include: { libro: true },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.ejemplar.findUnique({
      where: { id },
      include: { libro: true },
    });
  }

  create(dto: CreateEjemplarDto) {
    return this.prisma.ejemplar.create({
      data: {
        libroId: dto.libroId,
        estado: (dto.estado as EstadoEjemplar) ?? EstadoEjemplar.DISPONIBLE,
      },
      include: { libro: true },
    });
  }

  update(id: number, dto: UpdateEjemplarDto) {
    return this.prisma.ejemplar.update({
      where: { id },
      data: {
        ...(dto.libroId !== undefined && { libroId: dto.libroId }),
        ...(dto.estado !== undefined && { estado: dto.estado as EstadoEjemplar }),
      },
      include: { libro: true },
    });
  }

  remove(id: number) {
    return this.prisma.ejemplar.delete({ where: { id } });
  }
}
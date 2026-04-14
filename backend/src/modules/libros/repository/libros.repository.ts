import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLibroDto } from '../dto/create-libro.dto';
import { UpdateLibroDto } from '../dto/update-libro.dto';

@Injectable()
export class LibrosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.libro.findMany({
      include: { categoria: true, autores: { include: { autor: true } } },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.libro.findUnique({
      where: { id },
      include: { categoria: true, autores: { include: { autor: true } } },
    });
  }

  create(dto: CreateLibroDto) {
    return this.prisma.libro.create({
      data: dto,
      include: { categoria: true, autores: { include: { autor: true } } },
    });
  }

  update(id: number, dto: UpdateLibroDto) {
    return this.prisma.libro.update({
      where: { id },
      data: dto,
      include: { categoria: true, autores: { include: { autor: true } } },
    });
  }

  remove(id: number) {
    return this.prisma.libro.delete({ where: { id } });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLibroDto } from '../dto/create-libro.dto';
import { UpdateLibroDto } from '../dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.libro.findMany({ include: { categoria: true, autores: { include: { autor: true } } } });
  }

  async findOne(id: number) {
    const libro = await this.prisma.libro.findUnique({ where: { id }, include: { categoria: true, autores: { include: { autor: true } } } });
    if (!libro) throw new NotFoundException(`Libro #${id} no encontrado`);
    return libro;
  }

  create(dto: CreateLibroDto) {
    return this.prisma.libro.create({ data: dto });
  }

  async update(id: number, dto: UpdateLibroDto) {
    await this.findOne(id);
    return this.prisma.libro.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.libro.delete({ where: { id } });
  }
}
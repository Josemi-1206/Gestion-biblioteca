import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLibroDto } from '../dto/create-libro.dto';
import { UpdateLibroDto } from '../dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.libro.findMany({
      include: { categoria: true, autores: { include: { autor: true } }, ejemplares: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const libro = await this.prisma.libro.findUnique({
      where: { id },
      include: { categoria: true, autores: { include: { autor: true } }, ejemplares: true },
    });
    if (!libro) throw new NotFoundException(`Libro #${id} no encontrado`);
    return libro;
  }

  async create(dto: CreateLibroDto) {
    const existe = await this.prisma.libro.findUnique({ where: { isbn: dto.isbn } });
    if (existe) throw new ConflictException(`Ya existe un libro con ISBN: ${dto.isbn}`);

    const { autoresIds, ...libroData } = dto as any;
    return this.prisma.libro.create({
      data: {
        ...libroData,
        ...(autoresIds?.length && {
          autores: { create: autoresIds.map((id: number) => ({ autorId: id })) },
        }),
      },
      include: { categoria: true, autores: { include: { autor: true } }, ejemplares: true },
    });
  }

  async update(id: number, dto: UpdateLibroDto) {
    await this.findOne(id);
    const { autoresIds, ...libroData } = dto as any;
    return this.prisma.libro.update({
      where: { id },
      data: libroData,
      include: { categoria: true, autores: { include: { autor: true } }, ejemplares: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.libro.delete({ where: { id } });
  }
}

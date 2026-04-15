import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAutorDto } from '../dto/create-autor.dto';
import { UpdateAutorDto } from '../dto/update-autor.dto';

@Injectable()
export class AutoresService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.autor.findMany();
  }

  async findOne(id: number) {
    const autor = await this.prisma.autor.findUnique({ where: { id } });
    if (!autor) throw new NotFoundException(`Autor #${id} no encontrado`);
    return autor;
  }

  create(dto: CreateAutorDto) {
    return this.prisma.autor.create({ data: dto });
  }

  async update(id: number, dto: UpdateAutorDto) {
    await this.findOne(id);
    return this.prisma.autor.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.autor.delete({ where: { id } });
  }
}
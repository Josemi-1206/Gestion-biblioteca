import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEjemplarDto } from './dto/create-ejemplar.dto';
import { UpdateEjemplarDto } from './dto/update-ejemplar.dto';

@Injectable()
export class EjemplaresService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.ejemplar.findMany({ include: { libro: true } });
  }

  async findOne(id: number) {
    const ejemplar = await this.prisma.ejemplar.findUnique({ where: { id }, include: { libro: true } });
    if (!ejemplar) throw new NotFoundException(`Ejemplar #${id} no encontrado`);
    return ejemplar;
  }

  create(dto: CreateEjemplarDto) {
    return this.prisma.ejemplar.create({ data: dto });
  }

  async update(id: number, dto: UpdateEjemplarDto) {
    await this.findOne(id);
    return this.prisma.ejemplar.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.ejemplar.delete({ where: { id } });
  }
}
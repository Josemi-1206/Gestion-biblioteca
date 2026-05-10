import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

@Injectable()
export class CategoriasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() { return this.prisma.categoria.findMany({ orderBy: { id: 'asc' } }); }
  findOne(id: number) { return this.prisma.categoria.findUnique({ where: { id } }); }
  findByNombre(nombre: string) { return this.prisma.categoria.findUnique({ where: { nombre } }); }
  create(dto: CreateCategoriaDto) { return this.prisma.categoria.create({ data: dto }); }
  update(id: number, dto: UpdateCategoriaDto) { return this.prisma.categoria.update({ where: { id }, data: dto }); }
  remove(id: number) { return this.prisma.categoria.delete({ where: { id } }); }
}

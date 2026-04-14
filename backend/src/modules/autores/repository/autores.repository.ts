import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAutorDto } from '../dto/create-autor.dto';
import { UpdateAutorDto } from '../dto/update-autor.dto';

@Injectable()
export class AutoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.autor.findMany({ orderBy: { id: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.autor.findUnique({ where: { id } });
  }

  create(dto: CreateAutorDto) {
    return this.prisma.autor.create({ data: dto });
  }

  update(id: number, dto: UpdateAutorDto) {
    return this.prisma.autor.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.autor.delete({ where: { id } });
  }
}

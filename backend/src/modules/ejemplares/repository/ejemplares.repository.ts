import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEjemplarDto } from '../dto/create-ejemplar.dto';
import { UpdateEjemplarDto } from '../dto/update-ejemplar.dto';

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
      data: dto,
      include: { libro: true },
    });
  }

  update(id: number, dto: UpdateEjemplarDto) {
    return this.prisma.ejemplar.update({
      where: { id },
      data: dto,
      include: { libro: true },
    });
  }

  remove(id: number) {
    return this.prisma.ejemplar.delete({ where: { id } });
  }
}

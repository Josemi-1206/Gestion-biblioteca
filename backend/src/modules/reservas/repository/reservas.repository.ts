import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { UpdateReservaDto } from '../dto/update-reserva.dto';

@Injectable()
export class ReservasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.reserva.findMany({
      include: { usuario: true, libro: true },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.reserva.findUnique({
      where: { id },
      include: { usuario: true, libro: true },
    });
  }

  create(dto: CreateReservaDto) {
    return this.prisma.reserva.create({
      data: dto,
      include: { usuario: true, libro: true },
    });
  }

  update(id: number, dto: UpdateReservaDto) {
    return this.prisma.reserva.update({
      where: { id },
      data: dto,
      include: { usuario: true, libro: true },
    });
  }

  remove(id: number) {
    return this.prisma.reserva.delete({ where: { id } });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.reserva.findMany({ include: { usuario: true, libro: true } });
  }

  async findOne(id: number) {
    const reserva = await this.prisma.reserva.findUnique({ where: { id }, include: { usuario: true, libro: true } });
    if (!reserva) throw new NotFoundException(`Reserva #${id} no encontrada`);
    return reserva;
  }

  create(dto: CreateReservaDto) {
    return this.prisma.reserva.create({ data: dto });
  }

  async update(id: number, dto: UpdateReservaDto) {
    await this.findOne(id);
    return this.prisma.reserva.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.reserva.delete({ where: { id } });
  }
}
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { UpdateReservaDto } from '../dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.reserva.findMany({
      include: { usuario: true, libro: { include: { categoria: true, autores: { include: { autor: true } } } } },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id },
      include: { usuario: true, libro: { include: { categoria: true } } },
    });
    if (!reserva) throw new NotFoundException(`Reserva #${id} no encontrada`);
    return reserva;
  }

  async create(dto: CreateReservaDto) {
    // Verificar usuario
    const usuario = await this.prisma.usuarioLector.findUnique({ where: { id: dto.usuarioId } });
    if (!usuario) throw new NotFoundException(`Usuario #${dto.usuarioId} no encontrado`);

    // Verificar libro
    const libro = await this.prisma.libro.findUnique({ where: { id: dto.libroId } });
    if (!libro) throw new NotFoundException(`Libro #${dto.libroId} no encontrado`);

    // Verificar que no tenga ya una reserva activa para este libro
    const reservaExistente = await this.prisma.reserva.findFirst({
      where: { usuarioId: dto.usuarioId, libroId: dto.libroId, estado: 'activa' },
    });
    if (reservaExistente) {
      throw new BadRequestException('El usuario ya tiene una reserva activa para este libro');
    }

    return this.prisma.reserva.create({
      data: { usuarioId: dto.usuarioId, libroId: dto.libroId, estado: 'activa' },
      include: { usuario: true, libro: true },
    });
  }

  async cancelar(id: number) {
    const reserva = await this.findOne(id);
    if (reserva.estado !== 'activa') {
      throw new BadRequestException(`La reserva ya está en estado: ${reserva.estado}`);
    }
    return this.prisma.reserva.update({
      where: { id },
      data: { estado: 'cancelada' },
      include: { usuario: true, libro: true },
    });
  }

  async update(id: number, dto: UpdateReservaDto) {
    await this.findOne(id);
    return this.prisma.reserva.update({ where: { id }, data: dto, include: { usuario: true, libro: true } });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.reserva.delete({ where: { id } });
  }
}

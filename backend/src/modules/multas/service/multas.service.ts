import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMultaDto } from '../dto/create-multa.dto';
import { UpdateMultaDto } from '../dto/update-multa.dto';

@Injectable()
export class MultasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.multa.findMany({
      include: { prestamo: { include: { usuario: true, ejemplar: { include: { libro: true } } } } },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const multa = await this.prisma.multa.findUnique({
      where: { id },
      include: { prestamo: { include: { usuario: true, ejemplar: { include: { libro: true } } } } },
    });
    if (!multa) throw new NotFoundException(`Multa #${id} no encontrada`);
    return multa;
  }

  async pagar(id: number) {
    const multa = await this.findOne(id);
    if (multa.estado === 'pagada') {
      throw new BadRequestException('Esta multa ya fue pagada');
    }
    return this.prisma.multa.update({
      where: { id },
      data: { estado: 'pagada' },
      include: { prestamo: { include: { usuario: true, ejemplar: { include: { libro: true } } } } },
    });
  }

  create(dto: CreateMultaDto) {
    return this.prisma.multa.create({ data: dto, include: { prestamo: true } });
  }

  async update(id: number, dto: UpdateMultaDto) {
    await this.findOne(id);
    return this.prisma.multa.update({ where: { id }, data: dto, include: { prestamo: true } });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.multa.delete({ where: { id } });
  }
}

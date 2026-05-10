import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePrestamoDto } from '../dto/create-prestamo.dto';
import { UpdatePrestamoDto } from '../dto/update-prestamo.dto';

const VALOR_MULTA_POR_DIA = 500; // $500 por día de retraso

@Injectable()
export class PrestamosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.prestamo.findMany({
      include: {
        usuario: true,
        ejemplar: { include: { libro: true } },
        multa: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const prestamo = await this.prisma.prestamo.findUnique({
      where: { id },
      include: {
        usuario: true,
        ejemplar: { include: { libro: true } },
        multa: true,
      },
    });
    if (!prestamo) throw new NotFoundException(`Préstamo #${id} no encontrado`);
    return prestamo;
  }

  async create(dto: CreatePrestamoDto) {
    // 1. Verificar que el usuario existe
    const usuario = await this.prisma.usuarioLector.findUnique({
      where: { id: dto.usuarioId },
      include: { prestamos: { where: { fechaDevolucionReal: null } } },
    });
    if (!usuario) throw new NotFoundException(`Usuario #${dto.usuarioId} no encontrado`);

    // 2. Verificar límite de préstamos activos
    const prestamosActivos = usuario.prestamos.length;
    if (prestamosActivos >= usuario.limitePrestamos) {
      throw new BadRequestException(
        `El usuario ya tiene ${prestamosActivos} préstamo(s) activo(s). Límite: ${usuario.limitePrestamos}`,
      );
    }

    // 3. Verificar que el ejemplar existe y está disponible
    const ejemplar = await this.prisma.ejemplar.findUnique({
      where: { id: dto.ejemplarId },
    });
    if (!ejemplar) throw new NotFoundException(`Ejemplar #${dto.ejemplarId} no encontrado`);
    if (ejemplar.estado !== 'DISPONIBLE') {
      throw new BadRequestException(`El ejemplar #${dto.ejemplarId} no está disponible (estado: ${ejemplar.estado})`);
    }

    // 4. Verificar que el usuario no tiene multas pendientes
    const multaPendiente = await this.prisma.multa.findFirst({
      where: {
        estado: 'pendiente',
        prestamo: { usuarioId: dto.usuarioId },
      },
    });
    if (multaPendiente) {
      throw new BadRequestException('El usuario tiene multas pendientes. Debe pagarlas antes de realizar un nuevo préstamo.');
    }

    // 5. Crear el préstamo y marcar el ejemplar como PRESTADO en una transacción
    const [prestamo] = await this.prisma.$transaction([
      this.prisma.prestamo.create({
        data: {
          usuarioId: dto.usuarioId,
          ejemplarId: dto.ejemplarId,
          fechaDevolucionEsperada: new Date(dto.fechaDevolucionEsperada),
        },
        include: {
          usuario: true,
          ejemplar: { include: { libro: true } },
        },
      }),
      this.prisma.ejemplar.update({
        where: { id: dto.ejemplarId },
        data: { estado: 'PRESTADO' },
      }),
    ]);

    return prestamo;
  }

  async devolver(id: number) {
    const prestamo = await this.findOne(id);
    if (prestamo.fechaDevolucionReal) {
      throw new BadRequestException('Este préstamo ya fue devuelto');
    }

    const ahora = new Date();
    const esperada = new Date(prestamo.fechaDevolucionEsperada);
    const diasRetraso = Math.max(
      0,
      Math.floor((ahora.getTime() - esperada.getTime()) / (1000 * 60 * 60 * 24)),
    );

    const results = await this.prisma.$transaction(async (tx) => {
      // Registrar devolución
      const prestamoActualizado = await tx.prestamo.update({
        where: { id },
        data: { fechaDevolucionReal: ahora },
        include: {
          usuario: true,
          ejemplar: { include: { libro: true } },
          multa: true,
        },
      });

      // Cambiar estado del ejemplar a DISPONIBLE
      await tx.ejemplar.update({
        where: { id: prestamo.ejemplarId },
        data: { estado: 'DISPONIBLE' },
      });

      // Crear multa automática si hay retraso
      let multa = null;
      if (diasRetraso > 0) {
        multa = await tx.multa.create({
          data: {
            prestamoId: id,
            valor: diasRetraso * VALOR_MULTA_POR_DIA,
            diasRetraso,
            estado: 'pendiente',
          },
        });
      }

      return { prestamo: prestamoActualizado, multa, diasRetraso };
    });

    return results;
  }

  async update(id: number, dto: UpdatePrestamoDto) {
    await this.findOne(id);
    return this.prisma.prestamo.update({
      where: { id },
      data: dto,
      include: {
        usuario: true,
        ejemplar: { include: { libro: true } },
        multa: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.prestamo.delete({ where: { id } });
  }
}

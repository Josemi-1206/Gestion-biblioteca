import { Injectable, NotFoundException } from '@nestjs/common';
import { PrestamosRepository } from '../repository/prestamos.repository';
import { CreatePrestamoDto } from '../dto/create-prestamo.dto';
import { UpdatePrestamoDto } from '../dto/update-prestamo.dto';

@Injectable()
export class PrestamosService {
  constructor(private readonly prestamosRepository: PrestamosRepository) {}

  findAll() {
    return this.prestamosRepository.findAll();
  }

  async findOne(id: number) {
    const prestamo = await this.prestamosRepository.findOne(id);
    if (!prestamo) throw new NotFoundException(`Préstamo con ID ${id} no encontrado`);
    return prestamo;
  }

  async create(dto: CreatePrestamoDto) {
    try {
      return await this.prestamosRepository.create({
        usuarioId: dto.usuarioId,
        ejemplarId: dto.ejemplarId,
        fechaDevolucionEsperada: new Date(dto.fechaDevolucionEsperada),
      });
    } catch (error: any) {
      if (error.code === 'P2003') throw new NotFoundException('El usuario o ejemplar referenciado no existe');
      throw error;
    }
  }

  async update(id: number, dto: UpdatePrestamoDto) {
    await this.findOne(id);
    return this.prestamosRepository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prestamosRepository.remove(id);
  }
}

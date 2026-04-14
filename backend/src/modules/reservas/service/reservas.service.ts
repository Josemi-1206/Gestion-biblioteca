import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservasRepository } from '../repository/reservas.repository';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { UpdateReservaDto } from '../dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(private readonly reservasRepository: ReservasRepository) {}

  findAll() {
    return this.reservasRepository.findAll();
  }

  async findOne(id: number) {
    const reserva = await this.reservasRepository.findOne(id);
    if (!reserva) throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    return reserva;
  }

  async create(dto: CreateReservaDto) {
    try {
      return await this.reservasRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2003') throw new NotFoundException('El usuario o libro referenciado no existe');
      throw error;
    }
  }

  async update(id: number, dto: UpdateReservaDto) {
    await this.findOne(id);
    return this.reservasRepository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.reservasRepository.remove(id);
  }
}

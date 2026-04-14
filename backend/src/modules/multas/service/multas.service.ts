import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { MultasRepository } from '../repository/multas.repository';
import { CreateMultaDto } from '../dto/create-multa.dto';
import { UpdateMultaDto } from '../dto/update-multa.dto';

@Injectable()
export class MultasService {
  constructor(private readonly multasRepository: MultasRepository) {}

  findAll() {
    return this.multasRepository.findAll();
  }

  async findOne(id: number) {
    const multa = await this.multasRepository.findOne(id);
    if (!multa) throw new NotFoundException(`Multa con ID ${id} no encontrada`);
    return multa;
  }

  async create(dto: CreateMultaDto) {
    const existing = await this.multasRepository.findByPrestamo(dto.prestamoId);
    if (existing) throw new ConflictException('Ya existe una multa para este préstamo');
    try {
      return await this.multasRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2003') throw new NotFoundException('El préstamo referenciado no existe');
      throw error;
    }
  }

  async update(id: number, dto: UpdateMultaDto) {
    await this.findOne(id);
    return this.multasRepository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.multasRepository.remove(id);
  }
}

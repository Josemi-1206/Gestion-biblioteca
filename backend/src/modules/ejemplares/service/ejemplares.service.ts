import { Injectable, NotFoundException } from '@nestjs/common';
import { EjemplaresRepository } from '../repository/ejemplares.repository';
import { CreateEjemplarDto } from '../dto/create-ejemplar.dto';
import { UpdateEjemplarDto } from '../dto/update-ejemplar.dto';

@Injectable()
export class EjemplaresService {
  constructor(private readonly ejemplaresRepository: EjemplaresRepository) {}

  findAll() {
    return this.ejemplaresRepository.findAll();
  }

  async findOne(id: number) {
    const ejemplar = await this.ejemplaresRepository.findOne(id);
    if (!ejemplar) throw new NotFoundException(`Ejemplar con ID ${id} no encontrado`);
    return ejemplar;
  }

  async create(dto: CreateEjemplarDto) {
    try {
      return await this.ejemplaresRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2003') throw new NotFoundException('El libro referenciado no existe');
      throw error;
    }
  }

  async update(id: number, dto: UpdateEjemplarDto) {
    await this.findOne(id);
    return this.ejemplaresRepository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.ejemplaresRepository.remove(id);
  }
}

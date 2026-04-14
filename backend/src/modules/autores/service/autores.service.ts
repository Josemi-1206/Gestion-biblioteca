import { Injectable, NotFoundException } from '@nestjs/common';
import { AutoresRepository } from '../repository/autores.repository';
import { CreateAutorDto } from '../dto/create-autor.dto';
import { UpdateAutorDto } from '../dto/update-autor.dto';

@Injectable()
export class AutoresService {
  constructor(private readonly autoresRepository: AutoresRepository) {}

  findAll() {
    return this.autoresRepository.findAll();
  }

  async findOne(id: number) {
    const autor = await this.autoresRepository.findOne(id);
    if (!autor) throw new NotFoundException(`Autor con ID ${id} no encontrado`);
    return autor;
  }

  async create(dto: CreateAutorDto) {
    return this.autoresRepository.create(dto);
  }

  async update(id: number, dto: UpdateAutorDto) {
    await this.findOne(id);
    return this.autoresRepository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.autoresRepository.remove(id);
  }
}

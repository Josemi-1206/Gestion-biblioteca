import { Injectable, NotFoundException } from '@nestjs/common';
import { AutoresRepository } from '../repository/autores.repository';
import { CreateAutorDto } from '../dto/create-autor.dto';
import { UpdateAutorDto } from '../dto/update-autor.dto';

@Injectable()
export class AutoresService {
  constructor(private readonly repo: AutoresRepository) {}

  findAll() { return this.repo.findAll(); }

  async findOne(id: number) {
    const autor = await this.repo.findOne(id);
    if (!autor) throw new NotFoundException(`Autor #${id} no encontrado`);
    return autor;
  }

  create(dto: CreateAutorDto) { return this.repo.create(dto); }

  async update(id: number, dto: UpdateAutorDto) {
    await this.findOne(id);
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}

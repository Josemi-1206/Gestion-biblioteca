import { Injectable, NotFoundException } from '@nestjs/common';
import { EjemplaresRepository } from '../repository/ejemplares.repository';
import { CreateEjemplarDto } from '../dto/create-ejemplar.dto';
import { UpdateEjemplarDto } from '../dto/update-ejemplar.dto';

@Injectable()
export class EjemplaresService {
  constructor(private readonly repo: EjemplaresRepository) {}

  findAll() { return this.repo.findAll(); }

  async findOne(id: number) {
    const e = await this.repo.findOne(id);
    if (!e) throw new NotFoundException(`Ejemplar #${id} no encontrado`);
    return e;
  }

  create(dto: CreateEjemplarDto) { return this.repo.create(dto); }

  async update(id: number, dto: UpdateEjemplarDto) {
    await this.findOne(id);
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriasRepository } from '../repository/categorias.repository';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly repo: CategoriasRepository) {}

  findAll() { return this.repo.findAll(); }

  async findOne(id: number) {
    const categoria = await this.repo.findOne(id);
    if (!categoria) throw new NotFoundException(`Categoría #${id} no encontrada`);
    return categoria;
  }

  async create(dto: CreateCategoriaDto) {
    const existe = await this.repo.findByNombre(dto.nombre);
    if (existe) throw new ConflictException(`Ya existe una categoría con el nombre: ${dto.nombre}`);
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    await this.findOne(id);
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}

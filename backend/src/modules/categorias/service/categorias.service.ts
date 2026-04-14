import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriasRepository } from '../repository/categorias.repository';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly categoriasRepository: CategoriasRepository) {}

  findAll() {
    return this.categoriasRepository.findAll();
  }

  async findOne(id: number) {
    const categoria = await this.categoriasRepository.findOne(id);
    if (!categoria) throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    return categoria;
  }

  async create(dto: CreateCategoriaDto) {
    try {
      return await this.categoriasRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictException('Ya existe una categoría con ese nombre');
      throw error;
    }
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    await this.findOne(id);
    try {
      return await this.categoriasRepository.update(id, dto);
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictException('Ya existe una categoría con ese nombre');
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.categoriasRepository.remove(id);
  }
}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { LibrosRepository } from '../repository/libros.repository';
import { CreateLibroDto } from '../dto/create-libro.dto';
import { UpdateLibroDto } from '../dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(private readonly librosRepository: LibrosRepository) {}

  findAll() {
    return this.librosRepository.findAll();
  }

  async findOne(id: number) {
    const libro = await this.librosRepository.findOne(id);
    if (!libro) throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    return libro;
  }

  async create(dto: CreateLibroDto) {
    try {
      return await this.librosRepository.create(dto);
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictException('Ya existe un libro con ese ISBN');
      if (error.code === 'P2003') throw new NotFoundException('La categoría referenciada no existe');
      throw error;
    }
  }

  async update(id: number, dto: UpdateLibroDto) {
    await this.findOne(id);
    try {
      return await this.librosRepository.update(id, dto);
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictException('Ya existe un libro con ese ISBN');
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.librosRepository.remove(id);
  }
}

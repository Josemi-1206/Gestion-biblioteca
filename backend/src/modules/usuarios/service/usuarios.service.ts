import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuariosRepository } from '../repository/usuarios.repository';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  findAll() {
    return this.usuariosRepository.findAll();
  }

  async findOne(id: number) {
    const usuario = await this.usuariosRepository.findOne(id);
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return usuario;
  }

  async create(dto: CreateUsuarioDto) {
    return this.usuariosRepository.create(dto);
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);
    return this.usuariosRepository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.usuariosRepository.remove(id);
  }
}

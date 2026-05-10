import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuariosRepository } from '../repository/usuarios.repository';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly repo: UsuariosRepository) {}

  findAll() { return this.repo.findAll(); }

  async findOne(id: number) {
    const u = await this.repo.findOne(id);
    if (!u) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return u;
  }

  create(dto: CreateUsuarioDto) { return this.repo.create(dto); }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}

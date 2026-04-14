import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Injectable()
export class UsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuarioLector.findMany({ orderBy: { id: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.usuarioLector.findUnique({ where: { id } });
  }

  create(dto: CreateUsuarioDto) {
    return this.prisma.usuarioLector.create({ data: dto });
  }

  update(id: number, dto: UpdateUsuarioDto) {
    return this.prisma.usuarioLector.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.usuarioLector.delete({ where: { id } });
  }
}

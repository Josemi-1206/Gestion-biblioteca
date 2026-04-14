import { Module } from '@nestjs/common';
import { CategoriasController } from './controller/categorias.controller';
import { CategoriasService } from './service/categorias.service';
import { CategoriasRepository } from './repository/categorias.repository';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriasRepository],
})
export class CategoriasModule {}

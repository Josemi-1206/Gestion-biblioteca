import { Module } from '@nestjs/common';
import { LibrosController } from './controller/libros.controller';
import { LibrosService } from './service/libros.service';
import { LibrosRepository } from './repository/libros.repository';

@Module({
  controllers: [LibrosController],
  providers: [LibrosService, LibrosRepository],
})
export class LibrosModule {}

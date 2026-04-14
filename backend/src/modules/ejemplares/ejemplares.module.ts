import { Module } from '@nestjs/common';
import { EjemplaresController } from './controller/ejemplares.controller';
import { EjemplaresService } from './service/ejemplares.service';
import { EjemplaresRepository } from './repository/ejemplares.repository';

@Module({
  controllers: [EjemplaresController],
  providers: [EjemplaresService, EjemplaresRepository],
})
export class EjemplaresModule {}

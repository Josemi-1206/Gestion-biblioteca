import { Module } from '@nestjs/common';
import { PrestamosController } from './controller/prestamos.controller';
import { PrestamosService } from './service/prestamos.service';
import { PrestamosRepository } from './repository/prestamos.repository';

@Module({
  controllers: [PrestamosController],
  providers: [PrestamosService, PrestamosRepository],
})
export class PrestamosModule {}

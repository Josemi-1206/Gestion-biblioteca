import { Module } from '@nestjs/common';
import { MultasController } from './controller/multas.controller';
import { MultasService } from './service/multas.service';
import { MultasRepository } from './repository/multas.repository';

@Module({
  controllers: [MultasController],
  providers: [MultasService, MultasRepository],
})
export class MultasModule {}

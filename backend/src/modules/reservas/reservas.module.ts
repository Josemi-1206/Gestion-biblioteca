import { Module } from '@nestjs/common';
import { ReservasController } from './controller/reservas.controller';
import { ReservasService } from './service/reservas.service';
import { ReservasRepository } from './repository/reservas.repository';

@Module({
  controllers: [ReservasController],
  providers: [ReservasService, ReservasRepository],
})
export class ReservasModule {}

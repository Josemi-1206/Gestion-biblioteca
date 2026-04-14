import { Module } from '@nestjs/common';
import { AutoresController } from './controller/autores.controller';
import { AutoresService } from './service/autores.service';
import { AutoresRepository } from './repository/autores.repository';

@Module({
  controllers: [AutoresController],
  providers: [AutoresService, AutoresRepository],
})
export class AutoresModule {}

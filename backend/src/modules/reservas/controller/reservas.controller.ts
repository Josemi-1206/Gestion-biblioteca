import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ReservasService } from '../service/reservas.service';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { UpdateReservaDto } from '../dto/update-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @Get()      findAll()                                                                         { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string)                                                 { return this.service.findOne(+id); }
  @Post()     create(@Body() dto: CreateReservaDto)                                            { return this.service.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateReservaDto)                  { return this.service.update(+id, dto); }
  @Delete(':id') remove(@Param('id') id: string)                                              { return this.service.remove(+id); }
}

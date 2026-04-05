import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly service: PrestamosService) {}

  @Get()    findAll()                                          { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string)                { return this.service.findOne(+id); }
  @Post()   create(@Body() dto: CreatePrestamoDto)            { return this.service.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdatePrestamoDto) { return this.service.update(+id, dto); }
  @Delete(':id') remove(@Param('id') id: string)             { return this.service.remove(+id); }
}
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { LibrosService } from '../service/libros.service';
import { CreateLibroDto } from '../dto/create-libro.dto';
import { UpdateLibroDto } from '../dto/update-libro.dto';

@Controller('libros')
export class LibrosController {
  constructor(private readonly service: LibrosService) {}

  @Get()    findAll()                                       { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string)             { return this.service.findOne(+id); }
  @Post()   create(@Body() dto: CreateLibroDto)            { return this.service.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateLibroDto) { return this.service.update(+id, dto); }
  @Delete(':id') remove(@Param('id') id: string)          { return this.service.remove(+id); }
}

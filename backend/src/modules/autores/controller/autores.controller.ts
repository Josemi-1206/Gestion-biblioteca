import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AutoresService } from './autores.service';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';

@Controller('autores')
export class AutoresController {
  constructor(private readonly service: AutoresService) {}

  @Get()    findAll()                                      { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string)            { return this.service.findOne(+id); }
  @Post()   create(@Body() dto: CreateAutorDto)           { return this.service.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateAutorDto) { return this.service.update(+id, dto); }
  @Delete(':id') remove(@Param('id') id: string)         { return this.service.remove(+id); }
}
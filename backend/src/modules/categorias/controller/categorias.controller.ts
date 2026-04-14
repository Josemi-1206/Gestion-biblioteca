import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CategoriasService } from '../service/categorias.service';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly service: CategoriasService) {}

  @Get()      findAll()                                                                         { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string)                                                 { return this.service.findOne(+id); }
  @Post()     create(@Body() dto: CreateCategoriaDto)                                          { return this.service.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateCategoriaDto)                { return this.service.update(+id, dto); }
  @Delete(':id') remove(@Param('id') id: string)                                              { return this.service.remove(+id); }
}

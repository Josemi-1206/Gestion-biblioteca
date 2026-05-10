import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EjemplaresService } from '../service/ejemplares.service';
import { CreateEjemplarDto } from '../dto/create-ejemplar.dto';
import { UpdateEjemplarDto } from '../dto/update-ejemplar.dto';

@Controller('ejemplares')
export class EjemplaresController {
  constructor(private readonly service: EjemplaresService) {}

  @Get()    findAll()                                          { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string)                { return this.service.findOne(+id); }
  @Post()   create(@Body() dto: CreateEjemplarDto)            { return this.service.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateEjemplarDto) { return this.service.update(+id, dto); }
  @Delete(':id') remove(@Param('id') id: string)             { return this.service.remove(+id); }
}

import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MultasService } from '../service/multas.service';
import { CreateMultaDto } from '../dto/create-multa.dto';
import { UpdateMultaDto } from '../dto/update-multa.dto';

@Controller('multas')
export class MultasController {
  constructor(private readonly service: MultasService) {}

  @Get()      findAll()                                                                         { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string)                                                 { return this.service.findOne(+id); }
  @Post()     create(@Body() dto: CreateMultaDto)                                              { return this.service.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateMultaDto)                    { return this.service.update(+id, dto); }
  @Delete(':id') remove(@Param('id') id: string)                                              { return this.service.remove(+id); }
}

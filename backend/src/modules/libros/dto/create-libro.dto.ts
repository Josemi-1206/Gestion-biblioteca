import { IsString, IsInt, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateLibroDto {
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  editorial: string;

  @IsInt()
  anio: number;

  @IsInt()
  categoriaId: number;

  @IsArray()
  @IsOptional()
  autoresIds?: number[];
}

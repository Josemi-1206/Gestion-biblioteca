import { IsString, IsInt, IsISBN } from 'class-validator';

export class CreateLibroDto {
  @IsISBN()
  isbn: string;

  @IsString()
  titulo: string;

  @IsString()
  editorial: string;

  @IsInt()
  anio: number;

  @IsInt()
  categoriaId: number;
}
import { IsString, IsInt, IsISBN, IsNotEmpty } from 'class-validator';

export class CreateLibroDto {
  @IsISBN()
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

}

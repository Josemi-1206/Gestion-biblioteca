import { Autor } from './autor.interface';
import { Categoria } from './categoria.interface';
import { Ejemplar } from './ejemplar.interface';

export interface LibroAutor {
  autor: Autor;
}

export interface Libro {
  id: number;
  isbn: string;
  titulo: string;
  editorial: string;
  anio: number;
  categoriaId: number;
  categoria?: Categoria;
  autores?: LibroAutor[];
  ejemplares?: Ejemplar[];
}

import { Libro } from './libro.interface';

export interface Ejemplar {
  id: number;
  libroId: number;
  estado: 'DISPONIBLE' | 'PRESTADO' | 'RESERVADO' | 'DETERIORADO' | 'BAJA';
  libro?: Libro;
}

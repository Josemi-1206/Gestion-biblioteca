import { Prestamo } from './prestamo.interface';

export interface Multa {
  id: number;
  prestamoId: number;
  valor: number;
  estado: 'pendiente' | 'pagada';
  diasRetraso: number;
  fechaGenerada: string;
  fechaPago?: string;
  prestamo?: Prestamo;
}

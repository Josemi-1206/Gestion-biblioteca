import { Libro } from './libro.interface';
import { UsuarioLector } from './usuario-lector.interface';

export interface Reserva {
  id: number;
  usuarioId: number;
  libroId: number;
  fechaReserva: string;
  estado: 'activa' | 'cancelada' | 'completada';
  usuario?: UsuarioLector;
  libro?: Libro;
}

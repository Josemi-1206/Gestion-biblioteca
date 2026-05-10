import { Ejemplar } from './ejemplar.interface';
import { UsuarioLector } from './usuario-lector.interface';

export interface Prestamo {
  id: number;
  usuarioId: number;
  ejemplarId: number;
  fechaPrestamo: string;
  fechaDevolucionEsperada: string;
  fechaDevolucionReal?: string;
  usuario?: UsuarioLector;
  ejemplar?: Ejemplar;
}

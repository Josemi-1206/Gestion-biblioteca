export interface UsuarioLector {
  id: number;
  nombre: string;
  tipo: 'ESTUDIANTE' | 'DOCENTE';
  limitePrestamos: number;
  email?: string;
  telefono?: string;
  direccion?: string;
  documento?: string;
}

export class PrestamoEntity {
  id: number;
  usuarioId: number;
  ejemplarId: number;
  fechaPrestamo: Date;
  fechaDevolucionEsperada: Date;
  fechaDevolucionReal?: Date;
}

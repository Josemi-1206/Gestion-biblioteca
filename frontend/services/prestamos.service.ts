import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '@/lib/api';
import { Prestamo } from '@/interfaces/prestamo.interface';

export const prestamosService = {
  getAll: () => apiGet<Prestamo[]>('/prestamos'),
  getOne: (id: number) => apiGet<Prestamo>(`/prestamos/${id}`),
  create: (data: { usuarioId: number; ejemplarId: number; fechaDevolucionEsperada: string }) =>
    apiPost<Prestamo>('/prestamos', data),
  devolver: (id: number) => apiPatch<any>(`/prestamos/${id}/devolver`, {}),
  delete: (id: number) => apiDelete<Prestamo>(`/prestamos/${id}`),
};

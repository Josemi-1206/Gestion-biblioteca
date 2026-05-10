import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Ejemplar } from '@/interfaces/ejemplar.interface';

export const ejemplaresService = {
  getAll: () => apiGet<Ejemplar[]>('/ejemplares'),
  getOne: (id: number) => apiGet<Ejemplar>(`/ejemplares/${id}`),
  create: (data: { libroId: number; estado?: string }) => apiPost<Ejemplar>('/ejemplares', data),
  update: (id: number, data: Partial<Ejemplar>) => apiPut<Ejemplar>(`/ejemplares/${id}`, data),
  delete: (id: number) => apiDelete<Ejemplar>(`/ejemplares/${id}`),
};

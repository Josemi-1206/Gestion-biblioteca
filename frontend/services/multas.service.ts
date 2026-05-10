import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '@/lib/api';
import { Multa } from '@/interfaces/multa.interface';

export const multasService = {
  getAll: () => apiGet<Multa[]>('/multas'),
  getOne: (id: number) => apiGet<Multa>(`/multas/${id}`),
  pagar: (id: number) => apiPatch<Multa>(`/multas/${id}/pagar`, {}),
  delete: (id: number) => apiDelete<Multa>(`/multas/${id}`),
};

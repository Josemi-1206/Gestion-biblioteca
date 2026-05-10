import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '@/lib/api';
import { Reserva } from '@/interfaces/reserva.interface';

export const reservasService = {
  getAll: () => apiGet<Reserva[]>('/reservas'),
  getOne: (id: number) => apiGet<Reserva>(`/reservas/${id}`),
  create: (data: { usuarioId: number; libroId: number }) => apiPost<Reserva>('/reservas', data),
  cancelar: (id: number) => apiPatch<Reserva>(`/reservas/${id}/cancelar`, {}),
  delete: (id: number) => apiDelete<Reserva>(`/reservas/${id}`),
};

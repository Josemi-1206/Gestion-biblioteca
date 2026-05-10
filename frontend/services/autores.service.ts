import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Autor } from '@/interfaces/autor.interface';

export const autoresService = {
  getAll: () => apiGet<Autor[]>('/autores'),
  getOne: (id: number) => apiGet<Autor>(`/autores/${id}`),
  create: (data: Omit<Autor, 'id'>) => apiPost<Autor>('/autores', data),
  update: (id: number, data: Partial<Autor>) => apiPut<Autor>(`/autores/${id}`, data),
  delete: (id: number) => apiDelete<Autor>(`/autores/${id}`),
};

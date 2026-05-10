import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Libro } from '@/interfaces/libro.interface';

export const librosService = {
  getAll: () => apiGet<Libro[]>('/libros'),
  getOne: (id: number) => apiGet<Libro>(`/libros/${id}`),
  create: (data: Partial<Libro> & { autoresIds?: number[] }) => apiPost<Libro>('/libros', data),
  update: (id: number, data: Partial<Libro>) => apiPut<Libro>(`/libros/${id}`, data),
  delete: (id: number) => apiDelete<Libro>(`/libros/${id}`),
};
